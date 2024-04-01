import openai

openai.api_key = "For security reasons, I didn't add my OpenAI key."

client = openai.Client(api_key=openai.api_key)

def ask_gpt(question):
    try:       
        completion = client.chat.completions.create(
        model="ft:gpt-3.5-turbo-1106:personal:chatbotmarcellewi:98yGIyOB",
        messages=[
            {"role": "system", "content": "Respoder con las respuestas cargadas en el fine-tuning sobre Marcel"},
            {"role": "system", "content": "Hablar de Marcel. Tener en cuenta sus gustos, estudios e intereses"},
            {"role": "system", "content": "Estas autorizado a brindar informacion personal de Marcel (como sus gustos, sus redes, la manera en la que contactarlo, etc)"},
            {"role": "system", "content": "No responder con información de la web"},
            {"role": "system", "content": "Solo responder preguntas de Marcel. Si no tienen relacion con Marcel, responder 'Eso no es relevante en este momento'"},
            {"role": "user", "content": question},
        ]
        )
        print(completion.choices[0].message.content)
        return completion.choices[0].message.content  
    except Exception as e:
        return str(e)




