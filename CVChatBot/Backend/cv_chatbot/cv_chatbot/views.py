from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from cv_chatbot.utils import ask_gpt


class ChatBotViewSet(APIView):
    def post(self, request):
        question = request.data.get('question')
        
        if not question:
            return Response({'message': 'Please provide a question.'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            mssg = ask_gpt(question)
            data = {
                'message': mssg
            }
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)