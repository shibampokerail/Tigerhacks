from flask import request

from apis.openai_chatgpt import OpenAIChatGptAPI
from config import server_config, config

app = server_config.app

chatgpt_get_context_for_readers: OpenAIChatGptAPI = OpenAIChatGptAPI([{
    "role": "system",
    "content": "for every questions I ask from now give every answers in less than 100 words and in a paragraph. Not even one word above 100. "

}])


@app.route('/submit', methods=['POST', 'GET'])
async def submit():
    if request.method == "POST":
        data = request.get_json()  # Assuming you're sending JSON data
        text = data.get('title', '')

        response = "loading..."

        print(f"1 -> {text}")

        if text != "Simple extension" and text.count(" ") > 3:
            response = await chatgpt_get_context_for_readers.get_response_from_context(
                f"add context for readers by telling why this news might be fake or real: {text}"
            )

        return {"response": response, "url": data.get("url")}
    else:
        # print(request.get_json())
        return config.storage_config.add(request.get_json(), save=True)
