from google import genai

# 🔑 Add your API key
client = genai.Client(api_key="AIzaSyCXRD51XO4RyDCIP4FlOpj-ahApORpReKg")

def list_models():
    try:
        models = client.models.list()

        print("✅ Available Models:\n")

        for model in models:
            print(model.name)

    except Exception as e:
        print("❌ Error fetching models:", e)


if __name__ == "__main__":
    list_models()