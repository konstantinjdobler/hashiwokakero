export default class ColorScheme{
    gridColor: string;
    nodeColor: string;
    highlightNodeColor: string;
    edgeColor: string;
    nodeFontColor: string;
    backgroundColor: string;
    accentColor: string;
    accentColor2: string;

    //constructor takes object instead of separate values for better readability in the static colorScheme functions

    constructor(temp: {gridColor: string, nodeColor: string, highlightNodeColor: string, edgeColor: string, nodeFontColor: string, 
        backgroundColor: string, accentColor: string, accentColor2: string}){
            this.gridColor = temp.gridColor;
            this.nodeColor = temp.nodeColor;
            this.highlightNodeColor = temp.highlightNodeColor;
            this.edgeColor = temp.edgeColor;
            this.nodeFontColor = temp.nodeFontColor;
            this.backgroundColor = temp.backgroundColor;
            this.accentColor = temp.accentColor;
            this.accentColor2 = temp.accentColor2;
        }
    static getAll(){
        return new Array(ColorScheme.blackOrangeRed(), ColorScheme.redGoldBlack(),
         ColorScheme.goldWhiteGrey(), ColorScheme.blackWhiteBlue(), ColorScheme.whiteBlueGreen() );
    }
    static whiteBlueGreen() {
        return new ColorScheme({
            gridColor: "rgba(20, 30, 30, 0.5)",
            nodeColor: "rgba(0, 0, 0, 1)",
            highlightNodeColor: "rgba(20, 20, 20, 0.9)",
            edgeColor: "rgba(0, 220, 220, 1)",
            nodeFontColor: "rgba(0, 220, 220, 1)",
            backgroundColor: "rgba(215, 237, 255, 1)",
            accentColor: "rgba(0, 100, 100, 0.8)",
            accentColor2: "rgba(0, 0, 0, 1)"
        })
        
}
    static blackOrangeRed() {
        return new ColorScheme({
            gridColor: "rgba(200, 105, 105, 0.3)",
            nodeColor: "rgba(200, 100, 0, 1)",
            highlightNodeColor: "rgba(200, 160, 0, 0.95)",
            edgeColor: "rgba(100, 0, 0, 1)",
            nodeFontColor: "rgba(0, 0, 0, 1)",
            backgroundColor: "rgba(0, 0, 0, 1)",
            accentColor: "rgba(255, 100, 0, 0.8)",
            accentColor2: "rgba(200, 160, 0, 1)"
        })
    }
    static redGoldBlack() {
        return new ColorScheme({
            gridColor: "rgba(255, 255, 255, 0.6)",
            nodeColor: "rgba(200, 160, 0, 1)",
            highlightNodeColor: "rgba(200, 160, 0, 1)",
            edgeColor: "rgba(0, 0, 0, 1)",
            nodeFontColor: "rgba(0, 0, 0, 1)",
            backgroundColor: "rgba(100, 0, 0, 1)",
            accentColor: "rgba(200, 160, 0, 1)",
            accentColor2: "rgba(0, 0, 0, 1)"
        })
    }
    static goldWhiteGrey() {
        return new ColorScheme({
            gridColor: "rgba(255, 255, 255, 0.6)",
            nodeColor: "rgba(255, 255, 200, 1)",
            highlightNodeColor: "rgba(200, 200, 200, 0.8)",
            edgeColor: "rgba(0, 0, 0, 0.8)",
            nodeFontColor: "rgba(200, 160, 0, 1)",
            backgroundColor: "rgba(200, 160, 0, 1)",
            accentColor: "rgba(255, 255, 255, 0.8)",
            accentColor2: "rgba(200, 200, 200, 1)"
        })
    }
    static blackWhiteBlue() {
        return new ColorScheme({
            gridColor: "rgba(0, 0, 200, 0.2)",
            nodeColor: "rgba(0, 0, 0, 1)",
            highlightNodeColor: "rgba(0, 0, 200, 1)",
            edgeColor: "rgba(0,0, 0, 1)",
            nodeFontColor: "rgba(255, 255, 255, 1)",
            backgroundColor: "rgba(255, 255, 255, 1)",
            accentColor: "rgba(0, 0, 0, 1)",
            accentColor2: "rgba(0, 0, 200, 1)"
        })
    }
}
