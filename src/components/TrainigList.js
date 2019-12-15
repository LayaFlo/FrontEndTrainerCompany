import React, {Component} from 'react';
import ReactTable from 'react-table'
import "react-table/react-table.css";
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {confirmAlert} from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'
import AddTraining from "./AddTraining"; // Import css

class TrainingList extends Component {
    constructor(props) {
        super(props);
        this.state = {trainings: []};
    }


    componentDidMount() {
        this.loadTraining();

    }

    // Load training section 
    loadTraining = () => {
        fetch(this.props.idLink)
            .then(res => res.json())
            .then(responseData => {
                this.setState({trainings: responseData.content})
            })
        console.log(this.props.idLink, "\n", this.props.customerLink, "\n")


    }
    // Add training section 
    addTraining = (newTraining) => {

        fetch('https://customerrest.herokuapp.com/api/trainings',
            {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(newTraining)
            })
            .then(
                toast.success("New training activity was added successfully!"), {
                    position: toast.POSITION.BOTTOM_LEFT
                }
            )
            .then(respond => this.loadTraining())
            .catch(error => console.error((error)))
    }

    // Delete training section 
    deleteTraining = (value) => {
        console.log(value, "this is delete")
        confirmAlert({

            message: 'Do you want to delete this training activity?',
            buttons: [
                {
                    label: 'Confirm',
                    onClick: () => fetch(value, {method: 'DELETE'})
                        .then(res => {
                                this.loadTraining()
                                toast.success("Deleted successfully!", {
                                        position: toast.POSITION.TOP_RIGHT
                                    }
                                )
                            }
                        ).catch(err => console.error(err))

                },
                {
                    label: 'Cancel'
                }
            ]
        })


    }

    // Edit Training section
    EditTraining(training, link) {
        fetch(link,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(training)
            })
            .then(
                toast.success("Changes are saved!"), {
                    position: toast.POSITION.BOTTOM_LEFT
                }
            )
            .catch(err => console.error(err))
    }

    renderEditable = (cellInfo) => {
        return (
            <div
                style={{backgroundColor: "#fafafa"}}
                contentEditable
                suppressContentEditableWarning
                onBlur={e => {
                    const data = [...this.state.trainings];
                    data[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
                    this.setState({trainings: data});
                }}
                dangerouslySetInnerHTML={{
                    __html: this.state.trainings[cellInfo.index][cellInfo.column.id]
                }}
            />
        )
    }


    // Render section
    render() {
        return (
            <div style={{
                position: "relative",
                width: "70%",
                top: "-20px",
                left: "15%"
            }}>
                <ToastContainer autoClose={3000}/>
                <div className="row">
                    <AddTraining addTraining={this.addTraining} customerLink={this.props.customerLink}/>

                </div>

                <ReactTable
                    data={this.state.trainings}
                    columns={[
                        {
                            Header: "Trainings",
                            columns: [
                                {
                                    Header: "Date",
                                    accessor: "date",
                                    Cell: this.renderEditable
                                },
                                {
                                    Header: "Duration",
                                    accessor: "duration",
                                    Cell: this.renderEditable
                                },
                                {
                                    Header: "Activity",
                                    accessor: "activity",
                                    Cell: this.renderEditable
                                },
                                {
                                    id: 'button',
                                    sortable: false,
                                    filterable: false,
                                    width: 100,
                                    accessor: 'links.self.href',
                                    Cell: ({value, row}) => (
                                        <button className="btn btn-outline-success btn-sm" onClick={() => {
                                            this.EditTraining(row, value)
                                        }}>Save</button>)
                                },
                                {
                                    id: "button",
                                    accessor: "links[1].href",
                                    filterable: false,
                                    sortable: false,
                                    width: 100,
                                    Cell: ({value}) => (
                                        <button className="btn btn-outline-warning btn-sm" onClick={() => {
                                            this.deleteTraining(value)
                                        }}>Delete</button>)


                                }
                            ]
                        }

                    ]}
                    filterable
                    defaultPageSize={2}
                    className="-striped -highlight "
                />
            </div>
        );
    }
}


export default TrainingList;