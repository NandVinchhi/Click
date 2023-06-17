import openai as ai
import os
import requests
from firebase_admin import credentials, initialize_app, storage
import uuid
import json
from credentials import OPENAI_KEY

ai.api_key = OPENAI_KEY
ai.organization = "org-4JcbCqNcem5LlvEy9OQTgJYA"

def chatgpt(prompt, model="gpt-3.5-turbo"):
    response = ai.ChatCompletion.create(
        model=model,
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": prompt}
        ]
    )
    message = response.choices[0].message.content
    return message

def dalle(prompt, dimension):
    
    response = ai.Image.create(
        prompt=prompt,
        n=1,
        size=dimension
    )
    
    bucket = storage.bucket()

    # Download the image
    image_url = response["data"][0]["url"]
    image_name = str(uuid.uuid1()) + ".png"
    image_content = requests.get(image_url).content
    with open(image_name, 'wb') as image_file:
        image_file.write(image_content)

    # Upload the image to Firebase
    blob = bucket.blob(image_name)
    blob.upload_from_filename(image_name)

    # Make the blob publicly viewable
    blob.make_public()

    # Delete the locally saved image
    os.remove(image_name)

    # Return the public url
    return blob.public_url

def getContent(description):
    prompt = f"""Generate landing page content based on a description. Return only a json object with the following fields: 
heroTitle - The core idea of the website in at most 6 words
heroSubtitle - A relevant subtitle to hero title, which contains at least 10 words
heroButtonText - Text, not more than 3 words, that the main call to action button contains
heroImage - an evocative image generation prompt for a banner image at the top of the website
ctaButtonText - A string of less than 3 words containing the text of a relevant call to action button
ctaSubtitle - A short subtitle for the call to action section
ctaTitle - A short title for the call to action section
statisticsTitle - A title to a section containing some relevant statistics
statisticsSubtitle - A subtitle for the statistics section which contains 3 statistics
statistic1Text - this contains the main numeric value of the first statistic
statistic1Subtext - contains a very short description of the first statistic (< 5 words)
statistic2Text - this contains the main numeric value of the second statistic
statistic2Subtext - contains a very short description of the second statistic (< 5 words)
statistic3Text - this contains the main numeric value of the third statistic
statistic3Subtext - contains a very short description of the third statistic (< 5 words)
featuresTitle - A title with atleast 3 words for the features section, which contains 3 core features
featuresSubtitle - A relevant subtitle for the features section
feature1Name - Name of the first feature
feature1Description - Description of the first feature
feature1Image - Evocative image generation prompt for the first feature
feature2Name - Name of the second feature
feature2Description - Description of the second feature
feature2Image - Evocative image generation prompt for the second feature
feature3Name - Name of the third feature
feature3Description - Description of the third feature
feature3Image - Evocative image generation prompt for the third feature

The given description is: {description}"""
    
    response = json.loads(chatgpt(prompt))
    cred = credentials.Certificate('serviceAccountKey.json')  # Update with path to your Firebase service account file
    bucket_name = "steve-c0c0c"

    try:
        default_app = initialize_app(cred, {
            'storageBucket': f'{bucket_name}.appspot.com'
        })
    except:
        pass

    response["heroImage"] = dalle(response["heroImage"], "1024x1024")
    response["feature1Image"] = dalle(response["feature1Image"], "512x512")
    response["feature2Image"] = dalle(response["feature2Image"], "512x512")
    response["feature3Image"] = dalle(response["feature3Image"], "512x512")
    return response