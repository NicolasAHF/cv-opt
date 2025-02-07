import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const analyzeCV = async (cvText) => {
  const systemPrompt = `
    Eres un experto en análisis y optimización de currículums.
    Analiza el siguiente CV y proporciona un análisis detallado en formato JSON con las siguientes propiedades:
    "estructura", "redaccion", "palabrasClave" y "compatibilidadATS".
    Cada propiedad debe ser un objeto que contenga:
      - "puntaje": un número del 1 al 10.
      - "sugerencias": un string con recomendaciones de mejora.
    Responde únicamente en formato JSON sin comentarios adicionales.
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
