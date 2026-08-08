import openai
import os
from datetime import datetime
import json
import re
from dateutil import parser

class MeetingService:
    def __init__(self):
        openai.api_key = os.getenv("OPENAI_API_KEY")

    def transcribe_audio(self, audio_file_path):
        """Transcribe audio using OpenAI Whisper API"""
        try:
            with open(audio_file_path, "rb") as audio_file:
                response = openai.Audio.transcribe(
                    model="whisper-1",
                    file=audio_file
                )
            return response.text
        except Exception as e:
            print(f"Transcription error: {e}")
            return None

    def extract_meeting_details(self, transcript):
        """Extract meeting details from transcript using OpenAI"""
        prompt = f"""
        Analyze the following meeting transcript and extract key information.
        Return ONLY valid JSON with these fields:
        - title: Meeting title/summary (brief)
        - date: Date mentioned (in YYYY-MM-DD format, if not mentioned use today)
        - time: Time mentioned (in HH:MM format, if not mentioned use current time)
        - duration: Duration mentioned (in minutes, if not mentioned use 60)
        - participants: List of people mentioned
        - agenda: Brief summary of what was discussed
        - action_items: List of action items from the meeting

        Transcript:
        {transcript}

        Return ONLY valid JSON, no other text.
        """

        try:
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a meeting assistant that extracts structured data from transcripts."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3,
                max_tokens=500
            )
            
            content = response.choices[0].message.content
            # Extract JSON from response
            json_match = re.search(r'\{.*\}', content, re.DOTALL)
            if json_match:
                return json.loads(json_match.group())
            return None
        except Exception as e:
            print(f"Extraction error: {e}")
            return None

    def process_meeting_audio(self, audio_file):
        """Process meeting audio - transcribe and extract details"""
        import tempfile
        
        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as tmp_file:
            tmp_file.write(audio_file)
            tmp_path = tmp_file.name

        try:
            # Step 1: Transcribe with Whisper API
            transcript = self.transcribe_audio(tmp_path)
            if not transcript:
                return {"error": "Failed to transcribe audio"}

            # Step 2: Extract meeting details with GPT
            meeting_data = self.extract_meeting_details(transcript)
            if not meeting_data:
                return {"error": "Failed to extract meeting details", "transcript": transcript}

            # Step 3: Parse date and time
            try:
                if meeting_data.get("date"):
                    parsed_date = parser.parse(meeting_data["date"]).strftime("%Y-%m-%d")
                    meeting_data["date"] = parsed_date
                else:
                    meeting_data["date"] = datetime.now().strftime("%Y-%m-%d")
            except:
                meeting_data["date"] = datetime.now().strftime("%Y-%m-%d")

            # Add transcript to response
            meeting_data["transcript"] = transcript

            return meeting_data

        finally:
            # Clean up temp file
            if os.path.exists(tmp_path):
                os.unlink(tmp_path)