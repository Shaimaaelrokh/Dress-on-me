import axios from 'axios';

const MISTRAL_API_KEY = "cl7OnxUSl6RTzEZtHO3Dv1m32ooBIbnX"; 
const URL = "https://api.mistral.ai/v1/chat/completions";

export const askMistral = async (userPrompt) => {
  try {
    const response = await axios.post(URL, {
      model: "mistral-small-latest",
      messages: [
        { 
          role: "system", 
          content: "أنت خبير موضة ودود في تطبيق Clothes Factory. ساعد المستخدمين في تنسيق ملابسهم والرد بالعربي الفصيح والودود." 
        },
        { role: "user", content: userPrompt }
      ]
    }, {
      headers: {
        "Authorization": `Bearer ${MISTRAL_API_KEY}`,
        "Content-Type": "application/json"
      }
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Mistral Error:", error.response?.data || error.message);
    return "حصلت مشكلة صغيرة في السيرفر، جربي تاني كمان شوية.";
  }
};