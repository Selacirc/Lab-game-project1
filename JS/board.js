export class GameBoard {
    constructor(container, numColumns, numRows, updateScoreCallback) {
        this.container = container;
        this.numColumns = numColumns;
        this.numRows = numRows;
        this.tiles = [];
        this.selectedTile = null;
        this.updateScore = updateScoreCallback;

        this.init();
    }

    init() {
        const tileClassNames = ['blue', 'green', 'purple', 'red', 'yellow'];
        const numTileTypes = tileClassNames.length;

        for (let i = 0; i < this.numColumns; i++) {
            this.tiles[i] = [];
            for (let j = 0; j < this.numRows; j++) {
                const randomIndex = Math.floor(Math.random() * numTileTypes);
                const className = tileClassNames[randomIndex];
                this.tiles[i][j] = { type: className };
            }
        }
    }

    render() {
        this.container.innerHTML = '';
    
        for (let i = 0; i < this.numColumns; i++) {
            for (let j = 0; j < this.numRows; j++) {
                const tile = document.createElement('div');
                tile.classList.add('game-item');
                tile.classList.add(this.tiles[i][j].type); // Add the tile color class
                tile.dataset.column = i;
                tile.dataset.row = j;
                tile.dataset.type = this.tiles[i][j].type; // Fixed typo: si -> i
                this.container.appendChild(tile);
            }
        }
    }

    handleTileClick(clickedTile) {
        const column = +clickedTile.dataset.column;
        const row = +clickedTile.dataset.row;

        if (!this.selectedTile) {
            this.selectedTile = { column, row, element: clickedTile };
            clickedTile.classList.add('selected');
        } else {
            const selectedColumn = this.selectedTile.column;
            const selectedRow = this.selectedTile.row;

            if (
                (Math.abs(column - selectedColumn) === 1 && row === selectedRow) ||
                (Math.abs(row - selectedRow) === 1 && column === selectedColumn)
            ) {
                // Corrected method name to match the actual method
                this.swapTiles(column, row, selectedColumn, selectedRow); 
            }
            this.selectedTile.element.classList.remove('selected');
            this.selectedTile = null;
        }
        this.render();
    }

 swapTiles(column1, row1, column2, row2) {
    const tile1 = this.tiles[column1][row1];
    const tile2 = this.tiles[column2][row2];

    // Temporarily swap the tiles
    const tempType = tile1.type;
    tile1.type = tile2.type;
    tile2.type = tempType;

    // Check for matches after the temporary swap
    const totalMatches = this.checkForMatches();

    if (totalMatches > 0) {
        // Matches found, update the score
        this.updateScore(totalMatches);
    } else {
        // No matches found, revert the swap
        tile2.type = tile1.type;
        tile1.type = tempType;
    }
    this.render();
}
    
    checkForMatches() {
        let matchesFound = false;
        let totalMatches = 0;
    
        do {
            const horizontalMatches = this.checkHorizontalMatches();
            const verticalMatches = this.checkVerticalMatches();
    
            totalMatches += horizontalMatches + verticalMatches;
    
            this.refillBoard();
            matchesFound = this.hasMatches();
        } while (matchesFound);
    
        return totalMatches;
    }

    findMatches(isHorizontal) {
        let matchCount = 0;
        const rowCount = isHorizontal ? this.numRows : this.numColumns;
        const colCount = isHorizontal ? this.numColumns : this.numRows;
    
        for (let i = 0; i < rowCount; i++) {
            let matchLength = 1;
            for (let j = 1; j < colCount; j++) {
                const currentTile = isHorizontal ? this.tiles[j][i] : this.tiles[i][j];
                const prevTile = isHorizontal ? this.tiles[j - 1][i] : this.tiles[i][j - 1];
    
                if (currentTile && prevTile && currentTile.type === prevTile.type) {
                    matchLength++;
                } else {
                    if (matchLength >= 3) {
                        matchCount += matchLength;
                        for (let m = 0; m < matchLength; m++) {
                            const x = isHorizontal ? j - 1 - m : i;
                            const y = isHorizontal ? i : j - 1 - m;
                            this.tiles[x][y].type = null;
                        }
                    }
                    matchLength = 1;
                }
            }
    
            if (matchLength >= 3) {
                matchCount += matchLength;
                for (let m = 0; m < matchLength; m++) {
                    const x = isHorizontal ? colCount - 1 - m : i;
                    const y = isHorizontal ? i : rowCount - 1 - m;
                    this.tiles[x][y].type = null;
                }
            }
        }
    
        return matchCount;
    }

   // Updated to match more than 3 and fixed null-check
   checkHorizontalMatches() {
    return this.findMatches(true);
}

// Similar changes for vertical matches
checkVerticalMatches() {
    return this.findMatches(false);

}
    refillBoard() {
        const tileClassNames = ['blue', 'green', 'purple', 'red', 'yellow'];
        const numTileTypes = tileClassNames.length;

        for (let column = 0; column < this.numColumns; column++) {
            let shiftAmount = 0;

            // Shift existing tiles down
            for (let row = this.numRows - 1; row >= 0; row--) {
                if (this.tiles[column][row].type === null) {
                    shiftAmount++;
                } else if (shiftAmount > 0) {
                    this.tiles[column][row + shiftAmount] = this.tiles[column][row];
                    this.tiles[column][row] = { type: null };
                }
            }

            // Fill the top with new tiles
            for (let row = 0; row < shiftAmount; row++) {
                const randomIndex = Math.floor(Math.random() * numTileTypes);
                this.tiles[column][row] = { type: tileClassNames[randomIndex] };
            }
        }
    }

    hasMatches() {
        for (let row = 0; row < this.numRows; row++) {
            for (let column = 0; column < this.numColumns - 2; column++) {
                const currentTile = this.tiles[column][row];
                const nextTile1 = this.tiles[column + 1][row];
                const nextTile2 = this.tiles[column + 2][row];
    
                if (currentTile && nextTile1 && nextTile2 &&
                    currentTile.type === nextTile1.type && 
                    currentTile.type === nextTile2.type
                ) {
                    return true;
                }
            }
        }
    
        for (let column = 0; column < this.numColumns; column++) {
            for (let row = 0; row < this.numRows - 2; row++) {
                const currentTile = this.tiles[column][row];
                const nextTile1 = this.tiles[column][row + 1];
                const nextTile2 = this.tiles[column][row + 2];
    
                if (currentTile && nextTile1 && nextTile2 &&
                    currentTile.type === nextTile1.type && 
                    currentTile.type === nextTile2.type
                ) {
                    return true;
                }
            }
        }
    
        return false;
    }

// Define the getTileColor function as you provided earlier

static getTileColor(tileType) {
    switch (tileType) {
      case 'red': return "url('../access/red-orb.png')";
      case 'blue': return "url('../access/blue-orb.png')";
      case 'green': return "url('../access/green-orb.png')";
      case 'yellow': return "url('../access/yellow-orb.png')";
      case 'purple': return "url('../access/purple-orb.png')";
      default: return 'gray';
    }
  }
}
