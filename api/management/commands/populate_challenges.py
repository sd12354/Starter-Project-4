"""
Django management command to populate Firestore with challenge grids
"""
from django.core.management.base import BaseCommand
from api.firebase_service import get_firestore_db
from firebase_admin import firestore

# Fixed challenge grids data
CHALLENGE_GRIDS = [
    {
        'id': 'challenge-1',
        'name': 'Challenge 1: Classic Boggle',
        'size': 4,
        'grid': [
            ['A', 'B', 'C', 'D'],
            ['E', 'F', 'G', 'H'],
            ['I', 'J', 'K', 'L'],
            ['M', 'N', 'O', 'P']
        ],
        'solutions': ['ABC', 'DEF', 'GHI', 'JKL', 'MNO', 'PQR', 'AFK', 'BGL', 'CHM', 'DIN'],
        'difficulty': 'easy',
    },
    {
        'id': 'challenge-2',
        'name': 'Challenge 2: Word Finder',
        'size': 4,
        'grid': [
            ['T', 'E', 'S', 'T'],
            ['W', 'O', 'R', 'D'],
            ['G', 'A', 'M', 'E'],
            ['P', 'L', 'A', 'Y']
        ],
        'solutions': ['TEST', 'WORD', 'GAME', 'PLAY', 'TEAR', 'STEM', 'WARD', 'RODE', 'GAME', 'MALE', 'PLAY', 'LAMP'],
        'difficulty': 'medium',
    },
    {
        'id': 'challenge-3',
        'name': 'Challenge 3: Quick Solve',
        'size': 4,
        'grid': [
            ['Q', 'U', 'I', 'C'],
            ['K', 'B', 'R', 'O'],
            ['W', 'N', 'N', 'D'],
            ['S', 'O', 'L', 'V']
        ],
        'solutions': ['QUICK', 'BROWN', 'DOWN', 'SOLVE', 'QUI', 'ICK', 'BRO', 'OWN', 'WON', 'SOL', 'OVE'],
        'difficulty': 'hard',
    },
    {
        'id': 'challenge-4',
        'name': 'Challenge 4: Letter Mix',
        'size': 4,
        'grid': [
            ['H', 'E', 'L', 'L'],
            ['O', 'W', 'O', 'R'],
            ['L', 'D', 'F', 'U'],
            ['N', 'I', 'N', 'E']
        ],
        'solutions': ['HELLO', 'WORLD', 'FUN', 'NINE', 'HEL', 'ELL', 'LLO', 'WOR', 'OLD', 'FUN', 'NIN', 'INE'],
        'difficulty': 'easy',
    },
    {
        'id': 'challenge-5',
        'name': 'Challenge 5: Vowel Challenge',
        'size': 4,
        'grid': [
            ['A', 'E', 'I', 'O'],
            ['U', 'B', 'C', 'D'],
            ['F', 'G', 'H', 'J'],
            ['K', 'L', 'M', 'N']
        ],
        'solutions': ['AEIO', 'BCDF', 'GHJK', 'LMN', 'AE', 'EI', 'IO', 'BC', 'CD', 'GH', 'HJ', 'LM', 'MN'],
        'difficulty': 'medium',
    },
    {
        'id': 'challenge-6',
        'name': 'Challenge 6: Common Words',
        'size': 4,
        'grid': [
            ['C', 'A', 'T', 'S'],
            ['D', 'O', 'G', 'S'],
            ['B', 'I', 'R', 'D'],
            ['F', 'I', 'S', 'H']
        ],
        'solutions': ['CAT', 'DOG', 'BIRD', 'FISH', 'CATS', 'DOGS', 'BIRDS', 'FISH', 'AT', 'OG', 'IR', 'IS'],
        'difficulty': 'easy',
    },
    {
        'id': 'challenge-7',
        'name': 'Challenge 7: Complex Grid',
        'size': 5,
        'grid': [
            ['S', 'T', 'A', 'R', 'T'],
            ['H', 'E', 'R', 'E', 'S'],
            ['T', 'H', 'E', 'E', 'N'],
            ['D', 'O', 'F', 'I', 'N'],
            ['I', 'S', 'H', 'E', 'D']
        ],
        'solutions': ['START', 'HERE', 'THEN', 'FINISH', 'THESE', 'THE', 'HER', 'FIN', 'SHE', 'HED'],
        'difficulty': 'hard',
    },
    {
        'id': 'challenge-8',
        'name': 'Challenge 8: Double Letters',
        'size': 4,
        'grid': [
            ['B', 'O', 'O', 'K'],
            ['L', 'O', 'O', 'K'],
            ['T', 'A', 'K', 'E'],
            ['M', 'A', 'D', 'E']
        ],
        'solutions': ['BOOK', 'LOOK', 'TAKE', 'MADE', 'BOO', 'OOK', 'LOO', 'TAK', 'MAD', 'ADE'],
        'difficulty': 'medium',
    },
    {
        'id': 'challenge-9',
        'name': 'Challenge 9: Alphabet Soup',
        'size': 4,
        'grid': [
            ['A', 'L', 'P', 'H'],
            ['A', 'B', 'E', 'T'],
            ['S', 'O', 'U', 'P'],
            ['T', 'I', 'M', 'E']
        ],
        'solutions': ['ALPHABET', 'SOUP', 'TIME', 'ALP', 'HAB', 'BET', 'SOU', 'TIM', 'IME'],
        'difficulty': 'hard',
    },
    {
        'id': 'challenge-10',
        'name': 'Challenge 10: Final Boss',
        'size': 4,
        'grid': [
            ['Z', 'E', 'B', 'R'],
            ['A', 'X', 'I', 'O'],
            ['M', 'A', 'T', 'H'],
            ['S', 'C', 'I', 'O']
        ],
        'solutions': ['ZEBRA', 'AXIO', 'MATH', 'SCIO', 'ZEB', 'RAX', 'MAT', 'SCI'],
        'difficulty': 'hard',
    }
]


class Command(BaseCommand):
    help = 'Populate Firestore with challenge grids'

    def handle(self, *args, **options):
        try:
            db = get_firestore_db()
            challenges_ref = db.collection('challenges')
            
            self.stdout.write('Starting to populate Firestore with challenge grids...')
            
            for challenge in CHALLENGE_GRIDS:
                # Convert 2D grid array to object format (Firestore doesn't support nested arrays)
                grid_object = {}
                for index, row in enumerate(challenge['grid']):
                    grid_object[str(index)] = row
                
                challenge_doc = {
                    'name': challenge['name'],
                    'size': challenge['size'],
                    'grid': grid_object,
                    'solutions': challenge['solutions'],
                    'difficulty': challenge['difficulty'],
                    'createdAt': firestore.SERVER_TIMESTAMP
                }
                
                # Set document
                challenges_ref.document(challenge['id']).set(challenge_doc)
                self.stdout.write(self.style.SUCCESS(f'✅ Added: {challenge["name"]} ({challenge["id"]})'))
            
            self.stdout.write(self.style.SUCCESS(f'\n✅ Successfully populated {len(CHALLENGE_GRIDS)} challenge grids to Firestore!'))
            self.stdout.write('Collection: challenges')
            
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'❌ Error: {str(e)}'))
            raise

