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
    
        // Intercambio de tipos de manera más directa
        [tile1.type, tile2.type] = [tile2.type, tile1.type];
    
        const totalMatches = this.checkForMatches();
    
        if (totalMatches > 0) {
            this.updateScore(totalMatches);
        } else {
            // Revertir el intercambio si no hay coincidencias
            [tile1.type, tile2.type] = [tile2.type, tile1.type];
        }
        this.render();
    }
    
    checkForMatches() {
        let totalMatches = 0;
        let matchesFound;
    
        do {
            matchesFound = false;
    
            const horizontalMatches = this.checkHorizontalMatches();
            const verticalMatches = this.checkVerticalMatches();
    
            totalMatches += horizontalMatches + verticalMatches;
    
            this.refillBoard();
    
            if (this.hasMatches()) {
                matchesFound = true;
            }
    
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
                        this.clearTiles(isHorizontal, j - 1, i, matchLength);
                    }
                    matchLength = 1;
                }
            }
    
            if (matchLength >= 3) {
                matchCount += matchLength;
                this.clearTiles(isHorizontal, colCount - 1, i, matchLength);
            }
        }
        return matchCount;
    }
    
    clearTiles(isHorizontal, x, y, length) {
        for (let m = 0; m < length; m++) {
            const posX = isHorizontal ? x - m : y;
            const posY = isHorizontal ? y : x - m;
            if (this.tiles[posX] && this.tiles[posX][posY]) {
                this.tiles[posX][posY].type = null;
            }
        }
    }
    
    checkHorizontalMatches() {
        return this.findMatches(true);
    }
    
    checkVerticalMatches() {
        return this.findMatches(false);
    }
    
    refillBoard() {
        const tileTypes = ['blue', 'green', 'purple', 'red', 'yellow'];
    
        for (let col = 0; col < this.numColumns; col++) {
            let emptySlots = 0;
    
            // Bajar los tiles existentes
            for (let row = this.numRows - 1; row >= 0; row--) {
                if (this.tiles[col][row] && this.tiles[col][row].type === null) {
                    emptySlots++;
                } else if (emptySlots > 0) {
                    this.moveTileDown(col, row, emptySlots);
                }
            }
    
            // Rellenar los espacios vacíos con nuevos tiles
            this.fillEmptySlots(col, emptySlots, tileTypes);
        }
    }
    
    moveTileDown(column, row, shiftAmount) {
        this.tiles[column][row + shiftAmount] = this.tiles[column][row];
        this.tiles[column][row] = { type: null };
    }
    
    fillEmptySlots(column, shiftAmount, tileTypes) {
        for (let row = 0; row < shiftAmount; row++) {
            const randomType = tileTypes[Math.floor(Math.random() * tileTypes.length)];
            this.tiles[column][row] = { type: randomType };
        }
    }
    

    hasMatches() {
        return this.checkDirectionalMatches(true) || this.checkDirectionalMatches(false);
    }
    
    checkDirectionalMatches(isHorizontal) {
        const rowCount = isHorizontal ? this.numRows : this.numColumns;
        const colCount = isHorizontal ? this.numColumns : this.numRows;
    
        for (let i = 0; i < rowCount; i++) {
            for (let j = 0; j < colCount - 2; j++) {
                const tile1 = isHorizontal ? this.tiles[j][i] : this.tiles[i][j];
                const tile2 = isHorizontal ? this.tiles[j + 1][i] : this.tiles[i][j + 1];
                const tile3 = isHorizontal ? this.tiles[j + 2][i] : this.tiles[i][j + 2];
    
                if (tile1 && tile2 && tile3 &&
                    tile1.type === tile2.type &&
                    tile1.type === tile3.type
                ) {
                    return true;
                }
            }
        }
        return false;
    }
    
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