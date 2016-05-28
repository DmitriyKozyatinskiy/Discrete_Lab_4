import vis from 'vis';

export default class Graph {
    constructor(containerId, nodes) {
        this._graph = null;
        this._data = {
            nodes: nodes,
            edges: [],
        };
        this._options = {
            autoResize: true,
            height: '100%',
            width: '100%',
        };
        this._container = document.getElementById(containerId);
    }
    
    setNodes(nodes) {
        this._data.nodes = nodes;
        return this;
    }

    setEdges(edges) {
        this._data.edges = edges;
        this._graph.setData(this._data);
        return this;
    }

    drawGraph() {
        try {
            this._graph.destroy();
        } catch (e) {}

        console.log(this._data);
        this._graph = new vis.Network(this._container, this._data, this._options);

        return this;
    }

    resetGraph() {
        this.setEdges([]);
    }
}