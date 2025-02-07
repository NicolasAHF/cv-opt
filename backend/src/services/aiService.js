import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const analyzeCV = async (cvText) => {
  const systemPrompt = `
    Eres un experto en análisis y optimización de currículums con un enfoque en compatibilidad ATS y efectividad en selección de personal.
Analiza el siguiente CV y genera un análisis detallado en formato JSON con las siguientes propiedades:

"estructura": Evalúa la claridad, organización y disposición del contenido.
"redaccion": Analiza la gramática, estilo y concisión del texto.
"palabrasClave": Identifica la presencia y efectividad de palabras clave relevantes para el sector o puesto objetivo.
"compatibilidadATS": Mide qué tan bien el CV cumple con los requisitos de los sistemas de seguimiento de candidatos (ATS).
Cada propiedad debe ser un objeto con los siguientes campos:

"puntaje": Un número del 1 al 10 que indica la calidad en esa categoría.
"sugerencias": Un string con recomendaciones de mejora detalladas.
Instrucciones adicionales:

Responde únicamente en formato JSON, sin comentarios adicionales ni texto fuera de la estructura JSON.
Asegúrate de que la salida sea estructurada correctamente y válida en formato JSON.
  `;

  try {
    // Con la nueva librería, usas `openai.chat.completions.create`
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: cvText },
      ],
      temperature: 0.7,
    });

    // La respuesta se encuentra en `response.choices`
    const messageContent = response.choices[0].message.content.trim();

    let analysisResult;
    try {
      analysisResult = JSON.parse(messageContent);
    } catch (parseError) {
      console.error("Error al parsear la respuesta JSON de OpenAI:", parseError);
      throw new Error("Error en el análisis del CV. Por favor, inténtalo de nuevo.");
    }

    return analysisResult;
  } catch (error) {
    console.error("Error en la llamada a OpenAI:", error);
    throw new Error("Error al analizar el CV utilizando IA.");
  }
};
