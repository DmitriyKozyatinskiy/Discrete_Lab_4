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
        this._$container.html(this._$table);
        this._data = {
            nodes: [],
            edges: []
        };
        this._fillTable();
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


    _fillTable() {
        this._data.nodes = [];
        this._$table.empty();

        const $table = $('#graphTable');
        const $firstRow = $('<tr>');
        this._$table.append($firstRow);

        for (let i = 0; i <= NODE_AMOUNT; i++) {
            const $column = $('<td>', {
                'html': i,
                'class': 'GraphTable__Header',
            });
            $firstRow.append($column);
        }

        for (let i = 1; i <= NODE_AMOUNT; i++) {
            const $row = $('<tr>');
            const currentRowNum = $table.find('tr').length;
            let $column = $('<td>', {
                'html': currentRowNum,
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

        this._setTableControls();
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
        return this;
    }
}