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

        console.log("init values", this.numColumns, this.numRows)

        for (let i = 0; i < this.numRows; i++) {
            this.tiles[i] = [];
            for (let j = 0; j < this.numColumns; j++) {
                const randomIndex = Math.floor(Math.random() * numTileTypes);
                const className = tileClassNames[randomIndex];
                this.tiles[i][j] = { type: className };
            }
        }
        console.log("Init", this.tiles)
    }

    render() {
        this.container.innerHTML = '';
        const tileClassNames = ['blue', 'green', 'purple', 'red', 'yellow'];
        const numTileTypes = tileClassNames.length;
    
        for (let i = 0; i < this.numRows; i++) {
            for (let j = 0; j < this.numColumns; j++) {
                if (!this.tiles[i][j].type) {
                    const tile = document.createElement('div');
                    tile.classList.add('game-item');
                    const randomIndex = Math.floor(Math.random() * numTileTypes);
                    const className = tileClassNames[randomIndex];
                    this.tiles[i][j] = { type: className };
                    tile.classList.add(className); // Add the tile color class
                    tile.dataset.column = i;
                    tile.dataset.row = j;
                    tile.dataset.type = this.tiles[i][j].type; // Fixed typo: si -> i
                    this.container.appendChild(tile)
                } else {

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
    }

    handleTileClick(clickedTile) {
        const column = +clickedTile.dataset.column;
        const row = +clickedTile.dataset.row;



        console.log("dataset", column, row, clickedTile.dataset)

        console.log("clicked tile ====>", clickedTile)
        console.log("this.selectedTile", this.selectedTile)

        if (!this.selectedTile) {
            this.selectedTile = { column, row, element: clickedTile };

            clickedTile.classList.add('selected');
        } else {
            const selectedColumn = this.selectedTile.column;
            const selectedRow = this.selectedTile.row;

            console.log("line 56", column, selectedColumn, row, selectedRow)

            console.log("Evaluation", Math.abs(column - selectedColumn) === 1 && row === selectedRow)
            console.log("Evaluation2", Math.abs(row - selectedRow) === 1 && column === selectedColumn)
            console.log("Evaluation3", Math.abs(column - selectedColumn))
            console.log("Evaluation4",  Math.abs(row - selectedRow))

            if (
                (Math.abs(column - selectedColumn) === 1 && row === selectedRow) ||
                (Math.abs(row - selectedRow) === 1 && column === selectedColumn)
            ) {
                // Corrected method name to match the actual method
                console.log("line 61 swap")
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

        console.log("swap tiles", tile1, tile2)

        let tile1Type = tile1.type
        let tile2Type = tile2.type
    
        // Intercambio de tipos de manera más directa
        console.log("types", tile1Type, tile2Type)
        // [tile1, tile2] = [tile2, tile1];
        tile1.type = tile2Type
        tile2.type = tile1Type

        // tile1.dataset.type = tile2Type
        // tile2.dataset.type = tile2Type
        console.log("before check")
    
        const totalMatches = this.checkForMatches();
        console.log("after check")

    
        if (totalMatches > 0) {
            this.updateScore(totalMatches);
        } else {
            console.log("reverting")
            tile1.type = tile1Type
            tile2.type = tile2Type
    
            // Revertir el intercambio si no hay coincidencias
            // [tile1.type, tile2.type] = [tile2.type, tile1.type];
        }
        this.render();
    }
    
    checkForMatches() {
        let totalMatches = 0;
        let matchesFound = true;

        while (matchesFound) {

            matchesFound = false;
    
            console.log("before directionals")
    
            const horizontalMatches = this.checkHorizontalMatches();
            const verticalMatches = this.checkVerticalMatches();
    
            console.log("after directionals")
    
            totalMatches += horizontalMatches + verticalMatches;
    
            this.refillBoard();
    
            if (this.hasMatches()) {
                console.log("has matches 105")
                matchesFound = true;
            }
        }
    
        // do {
    
        // } while (matchesFound);
    
        return totalMatches;
    }
    
    findMatches(isHorizontal, tiles) {
        let matchCount = 0;
        // const rowCount = isHorizontal ? this.numRows : this.numColumns;
        // const colCount = isHorizontal ? this.numColumns : this.numRows;

        // console.log("find matches", rowCount, colCount)

        console.log("147", this.tiles)

        if (isHorizontal) {
            this.tiles.forEach((row) => {
                row.forEach((col, i, arr) => {
                    // if (col !== null) {

                    //     console.log("166", col)
                    // }
                    // if (arr[i + 2]) {

                    //     console.log("array + 1", arr[i + 2].type)
                    // }
                    if(col && col.type && arr[i + 2] && arr[i + 2].type) {

                        // console.log("Each type", col)
                        let type = col.type


                        if (arr[i + 1] && arr[i + 1].type === type && arr[i + 2] && arr[i + 2].type === type) {
                            console.log("match horizontal")
                            arr[i].type = ''
                            arr[i + 1].type = ''
                            arr[i + 2].type = ''
                            matchCount++
                        }

                    }
                })
            })
        }

        // if (isHorizontal) {
        //     for (let i = 0; i < this.numRows; i++) {
        //         for (let j = 0; j < this.numColumns; j++) {
        //             // console.log("horizontal tile", tiles[i][j], i, j)
        //             console.log("type", tiles[i][j], i, j)
        //             // console.log("bracket", tiles[i][j]["type"])
        //             if (tiles[i][j] !== null && tiles[i][j+1] !== null && tiles[i][j + 2] !== null) {
        //                 let type = tiles[i][j].type
        //                 if (tiles[i][j].type === type && tiles[i][j + 1].type === type && tiles[i][j + 2].type === type) {
        //                     console.log("TRUE horizontal")
        //                     matchCount++
        //                     tiles[i][j] = null
        //                     tiles[i][j + 1] = null
        //                     tiles[i][j + 2] = null
        //                 } 
        //             }
        //             else {
                        
        //                 continue
        //             }
        //         }
        //     }
            // this.refillBoard()
         else {

            this.tiles.forEach((row, iteration, array) => {
                console.log("211", row, iteration, array)
                if (array[iteration + 2]) {

                    console.log("211 type", array[iteration + 2])
                }
                if (array[iteration + 2]) {
                    console.log("241")
                    row.forEach((col, i, arr) => {
                        console.log("each type 243", col)
                        let type = col.type
                        console.log("245 type", type)
                        if (array[iteration + 1]) {

                            console.log("array iteration", array[iteration + 1][i].type)
                        }
                        if (type && array[iteration + 1][i].type === type && array[iteration + 2][i] && array[iteration + 2][i].type === type) {
                            console.log("Match vertical")
                            arr[i].type = ''
                            array[iteration + 1][i].type = ''
                            array[iteration + 2][i].type = ''
                            matchCount++

                        }
                    })
                }
            })
            
            // for (let i = 0; i < this.numRows; i++) {
            //     for (let j = 0; j < this.numColumns; j++) {
            //         console.log("type vertical", tiles[i][j], i, j)
            //         if (tiles[i][j] !== null && tiles[i][j+1] !== null && tiles[i][j + 2] !== null) {
            //             let type = tiles[i][j].type
            //             if (tiles[i][j]?.type == type && tiles[i + 1][j]?.type === type && tiles[i + 2][j]?.type === type) {
            //                 console.log("TRUE vertical")
            //                 matchCount++
            //                 tiles[i][j] = null
            //                 tiles[i + 1][j] = null
            //                 tiles[i + 2][j] = null
            //             } 
                        
            //         }
            //         else {

            //             continue
            //     }
            //     }
            // }
            // this.refillBoard()
        }
    
        // for (let i = 0; i < rowCount; i++) {
        //     let matchLength = 1;
        //     for (let j = 1; j < colCount; j++) {
        //         const currentTile = isHorizontal ? this.tiles[i][j] : this.tiles[j][i];
        //         const prevTile = isHorizontal ? this.tiles[i][j - 1] : this.tiles[j - 1][i];
    
        //         if (currentTile && prevTile && currentTile.type === prevTile.type) {
        //             matchLength++;
        //         } else {
        //             if (matchLength >= 3) {
        //                 matchCount += matchLength;
        //                 this.clearTiles(isHorizontal, j - 1, i, matchLength);
        //             }
        //             matchLength = 1;
        //         }
        //     }
    
        //     if (matchLength >= 3) {
        //         matchCount += matchLength;
        //         this.clearTiles(isHorizontal, colCount - 1, i, matchLength);
        //     }
        // }
        return matchCount;
    }
    
    clearTiles(isHorizontal, x, y, length) {
        console.log("clear tile", x, y, length)
        for (let m = 0; m < length; m++) {
            const posX = isHorizontal ? x - m : y;
            const posY = isHorizontal ? y : x - m;
            if (this.tiles[posX] && this.tiles[posX][posY]) {
                this.tiles[posX][posY].type = null;
            }
        }
    }
    
    checkHorizontalMatches() {
       return this.findMatches(true, this.tiles);
    }
    
    checkVerticalMatches() {
       return this.findMatches(false, this.tiles);
    }
    
    refillBoard() {
        const tileTypes = ['blue', 'green', 'purple', 'red', 'yellow'];
    
        for (let row = 0; row < this.numRows; row++) {
            let emptySlots = 0;
    
            // Bajar los tiles existentes
            for (let column = 0; column < this.numColumns; column++) {
                if (this.tiles[row][column] && this.tiles[row][column].type === null) {
                    this.tiles[row][column] = this.fillEmptySlots(tileTypes)
                    // emptySlots++;
                } 
                // else if (emptySlots > 0) {
                //     this.moveTileDown(row, column, emptySlots);
                // }
                // this.fillEmptySlots(column, emptySlots, tileTypes);
            }
    
            // Rellenar los espacios vacíos con nuevos tiles
        }
    }
    
    moveTileDown(column, row, shiftAmount) {
        this.tiles[column][row + shiftAmount] = this.tiles[column][row];
        this.tiles[column][row] = { type: null };
    }
    
    fillEmptySlots(tileTypes) {
        // console.log("Trying to fill", column, shiftAmount, tileTypes)
        // console.log("column", column)
        // console.log("shiftAmount", shiftAmount)
        // console.log("tileValues", tileTypes)
        // for (let row = 0; row < shiftAmount; row++) {
        //     const randomType = tileTypes[Math.floor(Math.random() * tileTypes.length)];
        //     this.tiles[row][column] = { type: randomType };
        // }
        const randomType = tileTypes[Math.floor(Math.random() * tileTypes.length)];
        return {type: randomType}
    }
    

    hasMatches() {
        return this.findMatches(true) || this.findMatches(false);
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
                } else {
                    return false;
                }
            }
        }
        // return false;
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