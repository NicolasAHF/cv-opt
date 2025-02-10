import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const analyzeCV = async (cvText, jobPosition) => {
  const systemPrompt = `
    Eres un experto en reclutamiento y optimización de currículums con amplia experiencia en sistemas ATS.
    
    Debes analizar el CV proporcionado considerando específicamente su adecuación para el puesto: "${jobPosition || 'No especificado'}".
    
    Realiza un análisis exhaustivo y devuelve un JSON con el siguiente formato:

    {
      "estructura": {
        "puntaje": (1-10),
        "sugerencias": "Recomendaciones detalladas para mejorar la estructura y organización del CV"
      },
      "redaccion": {
        "puntaje": (1-10),
        "sugerencias": "Sugerencias para mejorar la claridad, impacto y profesionalismo de la redacción"
      },
      "palabrasClave": {
        "puntaje": (1-10),
        "sugerencias": "Recomendaciones sobre keywords relevantes para el puesto específico y la industria"
      },
      "compatibilidadATS": {
        "puntaje": (1-10),
        "sugerencias": "Consejos para mejorar la compatibilidad con sistemas ATS, incluyendo formato y términos clave"
      }
    }

    Criterios de evaluación:
    - Estructura: Organización lógica, jerarquía clara, uso efectivo del espacio
    - Redacción: Claridad, concisión, logros cuantificables, verbos de acción
    - Palabras Clave: Alineación con el puesto objetivo, términos relevantes de la industria
    - Compatibilidad ATS: Formato limpio, keywords del puesto, ausencia de elementos que confundan al ATS

    Las sugerencias deben ser:
    - Específicas para el puesto indicado
    - Accionables y concretas
    - Priorizadas por impacto
    - Expresadas en un tono profesional y constructivo

    Responde ÚNICAMENTE con el JSON, sin texto adicional ni explicaciones.
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { 
          role: "user", 
          content: `Puesto objetivo: ${jobPosition || 'No especificado'}\n\nCV a analizar:\n${cvText}` 
        }
      ],
      temperature: 0.5, // Reducido para mayor consistencia
    });

    const messageContent = response.choices[0].message.content.trim();

    try {
      return JSON.parse(messageContent);
    } catch (parseError) {
      console.error("Error al parsear la respuesta JSON de OpenAI:", parseError);
      throw new Error("Error en el análisis del CV. Por favor, inténtalo de nuevo.");
    }
  } catch (error) {
    console.error("Error en la llamada a OpenAI:", error);
    throw new Error("Error al analizar el CV utilizando IA.");
  }
};