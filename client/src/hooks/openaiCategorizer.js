import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: false
});

export const categorizeProductWithOpenAI = async (productName) => {
  try {
    const prompt = `
    You are a product categorization assistant. Based on the following categories and subcategories, assign the correct subcategory to the product.

    Categories and Subcategories:
    Beverages & Milk:
        - Cocoa Beverages
        - Everyday Tea
        - Coffee
        - Herbal Teas
        - Milk

    Breakfast & Cereals:
        - Oats & Instant Cereals
        - Sugar, Honey & Sweeteners
        - Butter, Cheese & Other Spreads

    Cooking Paste, Oil & Spices:
        - Tomato Paste
        - Cooking Oils
        - Salt & Seasoning Cubes
        - Herbs & Spices

    Foodstuff:
        - Grains & Rice
        - Pasta & Noodles
        - Poundo, Wheat & Semolina
        - Canned Foods

    Snacks & Confectioneries:
        - Biscuits, Chin Chin & Cookies
        - Nuts & Seeds
        - Chocolates & Sweets
        - Dry Fruits

    Baking Ingredients:
        - Flour & Baking Powder 
        - Baking Tools & Accessories

    Alcoholic Drinks:
        - Beer
        - Liquers & Creams
        - Cognac & Spirits
        - Wines & Champagne 

    Non-Alcoholic Drinks:
        - Fizzy Drinks & Malt
        - Energy Drinks 
        - Wines
        - Fruit Juices & Yoghurt
        - Water

    Baby & Kids:
        - Diapering
        - Baby & Toddler Health
        - Daily Care
        - Feeding & Nursing
        - Toys & Gears
        - School Bag

    Detergent & Laundry Supplies:
        - Bar Soaps & Detergents
        - Bathroom & Toilet Cleaners
        - Fabric Softeners
        - Dish Washers
        - Glass Cleaner 
        - Disinfectant & Sprays

    Home Care & Household Supplies:
        - Paper Towels & Serviettes
        - Foil Paper & Cling Film
        - Pests & Insect Control
        - Lighters and Match Box
        - Air Fresheners 

    Beauty & Personal Care:
        - Skin Care
        - Oral Care
        - Hair Care
        - Fragrances
        - Feminine Care
        - Men's Grooming
        - Make-up
        - Male Shoe
        - Female Shoe

    Product: "${productName}"
    Subcategory:
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "user", content: prompt }
      ],
      max_tokens: 60,
      temperature: 0.5,
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error categorizing product:", error);
    return "unknown";
  }
};
