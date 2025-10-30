"""
Sameer Dhanda
@03096291
"""


class Boggle:
    def __init__(self, grid=None, dictionary=None):
        """
        Constructor: Initialize the Boggle game
        """
        self.grid = grid if grid else []
        self.dictionary = dictionary if dictionary else []
        self.solutions = []

    def setGrid(self, grid):
        """
        Set the Boggle grid
        """
        self.grid = grid

    def setDictionary(self, dictionary):
        """
        Set the dictionary of valid words
        """
        self.dictionary = dictionary

    def _expand_tile(self, tile):
        """
        Expand special tiles that represent multiple letters
        """
        tile_upper = tile.upper()
        if tile_upper == "QU":
            return "QU"
        elif tile_upper == "ST":
            return "ST"
        else:
            return tile_upper

    def getSolution(self):
        """
        Find and return all valid words in the grid using depth-first search
        """
        # Reset solutions for each new search
        self.solutions = []

        # Handle edge cases: empty grid or dictionary
        if not self.grid or not self.dictionary:
            return []

        rows = len(self.grid)
        cols = len(self.grid[0]) if rows > 0 else 0

        # Handle empty dimensions
        if rows == 0 or cols == 0:
            return []

        # Convert dictionary to uppercase for case-insensitive matching
        dict_set = set(word.upper() for word in self.dictionary)

        prefixes = set()
        for word in dict_set:
            for i in range(1, len(word) + 1):
                prefixes.add(word[:i])

        def dfs(row, col, visited, current_word):
            """
            Depth-first search to find words starting from (row, col)
            """
            # Stop if current word is not a valid prefix
            if current_word not in prefixes:
                return

            # Check if current word is valid (3+ letters and in dictionary)
            if len(current_word) >= 3 and current_word in dict_set:
                # Avoid duplicates
                if current_word not in self.solutions:
                    self.solutions.append(current_word)

            # Explore all 8 adjacent directions
            directions = [(-1, -1), (-1, 0), (-1, 1),
                          (0, -1),           (0, 1),
                          (1, -1),  (1, 0),  (1, 1)]

            for dr, dc in directions:
                new_row = row + dr
                new_col = col + dc

                # Check if new position is within bounds and not visited
                if (0 <= new_row < rows and
                    0 <= new_col < cols and
                        (new_row, new_col) not in visited):

                    # Get the expanded tile value
                    tile_value = self._expand_tile(
                        self.grid[new_row][new_col])

                    # Mark this tile as visited
                    visited.add((new_row, new_col))

                    # Recursively search from the new position
                    dfs(new_row, new_col, visited,
                        current_word + tile_value)

                    # Backtrack: remove this tile from visited set
                    visited.remove((new_row, new_col))

        # Start DFS from each cell in the grid
        for r in range(rows):
            for c in range(cols):
                # Get the starting tile value
                starting_tile = self._expand_tile(self.grid[r][c])

                # Initialize visited set with current starting position
                initial_visited = {(r, c)}

                # Begin search from this cell
                dfs(r, c, initial_visited, starting_tile)

        return self.solutions


def main():
    # Example 4x4 grid
    grid = [["A", "B", "C", "D"],
            ["E", "F", "G", "H"],
            ["I", "J", "K", "L"],
            ["A", "B", "C", "D"]]

    # Example dictionary
    dictionary = ["ABEF", "AFJIEB", "DGKD", "DGKA"]

    # Create Boggle instance and solve
    mygame = Boggle(grid, dictionary)
    print(mygame.getSolution())


if __name__ == "__main__":
    main()