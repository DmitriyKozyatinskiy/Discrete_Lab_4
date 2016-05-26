import $ from 'jquery';
import _ from 'lodash/array'
import Mustache from 'mustache';
import './Table.scss';
import tableControlsTemplate from './TableControls.html';

const NODE_AMOUNT = 10;

export default class Table {
    constructor(containerId, graph) {
        this._graph = graph;
        this._$container = $(`#${containerId}`);
        this._$table = $('<table>', {
            'id': 'graphTable',
            'class': 'table table-bordered'
        });
        this._data = {
            nodes: [],
            edges: []
        };
    }

    setGraph(graph) {
        this._graph = graph;
        return this;
    }

    getData() {
        return this._data;
    }

    getNodes() {
        return this._data.nodes;
    }

    setNodes(nodes) {
        this._data.nodes = nodes;
        return this;
    }

    getEdges() {
        return this._data.edges;
    }

    setEdges(edges) {
        this._data.edges = edges;
        return this;
    }

    fillIncidenceTable() {
        this._$container.empty();

        $('<h4>', {
            html: 'Таблиця інцидентності'
        }).appendTo(this._$container);
        this._$table.empty().appendTo(this._$container);

        let $row = $('<tr>');
        this._$table.append($row);

        for (let i = 0; i <= this._data.edges.length; i++) {
            let $column = $('<td>', {
                'html': i ? 'a' + i : '',
                'class': 'GraphTable__Header',
            });
            $row.append($column);
        }

        for (let i = 1; i <= this._data.nodes.length; i++) {
            let $row = $('<tr>');
            let $column = $('<td>', {
                'html': 'x' + i,
                'class': 'GraphTable__Header',
            });
            $row.append($column);

            this._data.edges.forEach((edge, j) => {
                console.log(edge);
                let $column = $('<td>', {
                    'data-row': i,
                    'data-column': j + 1,
                    'class': 'GraphTable__Cell js-graph-table-cell'
                });

                let colData;

                if (edge.to == i && edge.from == i) {
                    colData = '-+1'
                } else if (edge.from == i) {
                    colData = '+1'
                } else if (edge.to == i) {
                    colData = '-1'
                } else {
                    colData = '0';
                }

                $column.html(colData);
                $row.append($column);
            });
            this._$table.append($row);
        }
    }

    fillTable() {
        this._data.nodes = [];
        this._$container.empty();

        $('<h4>', {
            html: 'Таблиця суміжності'
        }).appendTo(this._$container);
        this._$table.empty().appendTo(this._$container);

        const $firstRow = $('<tr>');
        this._$table.append($firstRow);

        for (let i = 0; i <= NODE_AMOUNT; i++) {
            let $column = $('<td>', {
                'html': i ? 'x' + i : '',
                'class': 'GraphTable__Header',
            });
            $firstRow.append($column);

            if (i) {
                const $row = $('<tr>');
                const currentRowNum = this._$table.find('tr').length;
                $column = $('<td>', {
                    'html': 'x' + currentRowNum,
                    'class': 'GraphTable__Header'
                });
                $row.append($column);

                this._data.nodes.push({
                    id: i,
                    label: i,
                });

                for (let j = 1; j <= NODE_AMOUNT; j++) {
                    $column = $('<td>', {
                        'data-row': i,
                        'data-column': j,
                        'class': 'GraphTable__Cell js-graph-table-cell'
                    });
                    $row.append($column);
                    $column.on('click', event => this._handleCellClick(event));
                }
                this._$table.append($row);
            }
        }

        // this._setTableControls();
        return this;
    }

    _resetTable() {
        this._data.edges = [];
        this._graph.resetGraph();
        $('.js-graph-table-cell').removeClass('js-is-selected').empty();
        return this;
    }

    _setTableControls() {
        const $controls = $(Mustache.render(tableControlsTemplate));
        this._$table.after($controls);
        $('#js-clear-graph').on('click', event => this._resetTable());
        return this;
    }

    _handleCellClick(event) {
        const $col = $(event.target);
        const row = $col.attr('data-row');
        const col = $col.attr('data-column');
        if ($col.hasClass('js-is-selected')) {
            $col.removeClass('js-is-selected').empty();
            _.remove(this._data.edges, edge => {
                return edge.from === row && edge.to === col;
            });
        } else {
            $col.addClass('js-is-selected').html('1');
            this._data.edges.push({
                from: row,
                to: col,
                arrows: 'to',
            });
        }

        if (this._graph) {
            this._graph.setEdges(this._data.edges);
        }
        
        try {
            this._clickHandler();
        } catch (e) {}
        
        return this;
    }

    setCellClickCallback(callback) {
        this._clickHandler = callback;
    }
}