import './RainbowTable.css';
import React from 'react';
import { Table, Column, Card} from 'react-rainbow-components';



class RainbowTable extends React.Component {
    
    constructor(props) {
        super(props);
        console.log(props);
        this.state = {
            sortedBy: undefined,
            sortDirection: 'asc',
            data: props.tableData,
        };
        this.handleOnSort = this.handleOnSort.bind(this);
    }

    handleOnSort(event, field, nextSortDirection) {
        const { data } = this.state;

        const newData = [...data];

        const key = value => value[field];
        const reverse = nextSortDirection === 'asc' ? 1 : -1;

        const sortedData = newData.sort((aItem, bItem) => {
            const aValue = key(aItem);
            const bValue = key(bItem);
            return reverse * ((aValue > bValue) - (bValue > aValue));
        });

        this.setState({ data: sortedData, sortedBy: field, sortDirection: nextSortDirection });
    }

    render() {
        const { data, sortDirection, sortedBy } = this.state;
        return (
            <Card className="card">
                <div className="tableContainer">
                    <Table
                        keyField="id"
                        data={data}
                        onSort={this.handleOnSort}
                        sortDirection={sortDirection}
                        sortedBy={sortedBy}
                    >
                        <Column header="Name" field="name" sortable />
                        <Column header="Email" field="email" sortable />
                        <Column header="Mobile" field="mobile" sortable />
                        <Column header="City" field="city" sortable />
                        
                    </Table>
                </div>
                </Card>
           
        );
    }
}

 export default RainbowTable;