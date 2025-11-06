"""
API views for Boggle challenges and leaderboard
"""
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .firebase_service import get_firestore_db
from firebase_admin import firestore

@api_view(['GET'])
def list_challenges(request):
    """Get list of all challenges with high scores"""
    try:
        db = get_firestore_db()
        challenges_ref = db.collection('challenges')
        challenges = []
        
        for doc in challenges_ref.stream():
            challenge_data = doc.to_dict()
            challenge_id = doc.id
            
            # Get high score for this challenge
            high_score = None
            high_score_player = None
            
            try:
                leaderboard_ref = db.collection('leaderboard')
                # Try to get high score
                high_score_query = leaderboard_ref.where('challengeId', '==', challenge_id).order_by('score', direction=firestore.Query.DESCENDING).limit(1)
                high_score_docs = list(high_score_query.stream())
                
                if high_score_docs:
                    score_data = high_score_docs[0].to_dict()
                    high_score = score_data.get('score') or score_data.get('foundWordsCount')
                    high_score_player = score_data.get('userName') or score_data.get('userEmail', 'Unknown')
            except Exception as e:
                # If query fails, try without order_by
                try:
                    all_scores_query = leaderboard_ref.where('challengeId', '==', challenge_id)
                    all_scores = list(all_scores_query.stream())
                    
                    if all_scores:
                        max_score = -1
                        best_score_data = None
                        for score_doc in all_scores:
                            score_data = score_doc.to_dict()
                            score_value = score_data.get('score') or score_data.get('foundWordsCount', 0)
                            if score_value > max_score:
                                max_score = score_value
                                best_score_data = score_data
                        
                        if max_score >= 0 and best_score_data:
                            high_score = max_score
                            high_score_player = best_score_data.get('userName') or best_score_data.get('userEmail', 'Unknown')
                except:
                    pass
            
            # Convert grid object to 2D array
            grid = challenge_data.get('grid', {})
            if isinstance(grid, dict):
                grid_array = []
                sorted_keys = sorted(grid.keys(), key=lambda x: int(x))
                for key in sorted_keys:
                    grid_array.append(grid[key])
            else:
                grid_array = grid
            
            challenges.append({
                'id': challenge_id,
                'name': challenge_data.get('name', challenge_id),
                'size': challenge_data.get('size', 4),
                'difficulty': challenge_data.get('difficulty', 'medium'),
                'grid': grid_array,
                'solutions': challenge_data.get('solutions', []),
                'highScore': high_score,
                'highScorePlayer': high_score_player,
            })
        
        # Sort by challenge number
        challenges.sort(key=lambda x: int(x['id'].replace('challenge-', '').replace('challenge', '0') or '0'))
        
        return Response(challenges, status=status.HTTP_200_OK)
    
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def get_challenge(request, challenge_id):
    """Get a specific challenge by ID"""
    try:
        db = get_firestore_db()
        challenge_doc = db.collection('challenges').document(challenge_id).get()
        
        if not challenge_doc.exists:
            return Response({'error': 'Challenge not found'}, status=status.HTTP_404_NOT_FOUND)
        
        challenge_data = challenge_doc.to_dict()
        
        # Convert grid object to 2D array
        grid = challenge_data.get('grid', {})
        if isinstance(grid, dict):
            grid_array = []
            sorted_keys = sorted(grid.keys(), key=lambda x: int(x))
            for key in sorted_keys:
                grid_array.append(grid[key])
        else:
            grid_array = grid
        
        return Response({
            'id': challenge_id,
            'name': challenge_data.get('name', challenge_id),
            'size': challenge_data.get('size', 4),
            'difficulty': challenge_data.get('difficulty', 'medium'),
            'grid': grid_array,
            'solutions': challenge_data.get('solutions', []),
        }, status=status.HTTP_200_OK)
    
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def submit_score(request):
    """Submit a score to the leaderboard"""
    try:
        data = request.data
        db = get_firestore_db()
        
        # Validate required fields
        required_fields = ['challengeId', 'userId', 'userName', 'score']
        for field in required_fields:
            if field not in data:
                return Response({'error': f'Missing required field: {field}'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Create score document
        score_data = {
            'challengeId': data['challengeId'],
            'challengeName': data.get('challengeName', ''),
            'userId': data['userId'],
            'userName': data['userName'],
            'userEmail': data.get('userEmail', ''),
            'userPhotoURL': data.get('userPhotoURL'),
            'score': data['score'],
            'foundWordsCount': data.get('foundWordsCount', data['score']),
            'totalWords': data.get('totalWords', 0),
            'timeElapsed': data.get('timeElapsed', 0),
            'timestamp': firestore.SERVER_TIMESTAMP,
            'createdAt': firestore.SERVER_TIMESTAMP,
        }
        
        # Add to leaderboard
        leaderboard_ref = db.collection('leaderboard')
        leaderboard_ref.add(score_data)
        
        return Response({'success': True, 'message': 'Score submitted successfully'}, status=status.HTTP_201_CREATED)
    
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def get_leaderboard(request, challenge_id):
    """Get leaderboard for a specific challenge"""
    try:
        db = get_firestore_db()
        leaderboard_ref = db.collection('leaderboard')
        
        # Get scores for this challenge
        scores_query = leaderboard_ref.where('challengeId', '==', challenge_id).order_by('score', direction=firestore.Query.DESCENDING).limit(10)
        
        scores = []
        try:
            for doc in scores_query.stream():
                score_data = doc.to_dict()
                scores.append({
                    'userId': score_data.get('userId'),
                    'userName': score_data.get('userName'),
                    'userEmail': score_data.get('userEmail'),
                    'userPhotoURL': score_data.get('userPhotoURL'),
                    'score': score_data.get('score') or score_data.get('foundWordsCount'),
                    'timeElapsed': score_data.get('timeElapsed', 0),
                    'timestamp': score_data.get('timestamp'),
                })
        except:
            # If order_by fails, get all and sort manually
            all_scores_query = leaderboard_ref.where('challengeId', '==', challenge_id)
            all_scores = []
            for doc in all_scores_query.stream():
                score_data = doc.to_dict()
                all_scores.append({
                    'userId': score_data.get('userId'),
                    'userName': score_data.get('userName'),
                    'userEmail': score_data.get('userEmail'),
                    'userPhotoURL': score_data.get('userPhotoURL'),
                    'score': score_data.get('score') or score_data.get('foundWordsCount', 0),
                    'timeElapsed': score_data.get('timeElapsed', 0),
                    'timestamp': score_data.get('timestamp'),
                })
            all_scores.sort(key=lambda x: x['score'], reverse=True)
            scores = all_scores[:10]
        
        return Response(scores, status=status.HTTP_200_OK)
    
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
