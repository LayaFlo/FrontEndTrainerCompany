import React, {Component} from 'react';
import ReactTable from 'react-table'
import "react-table/react-table.css";
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {confirmAlert} from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css
import AddCustomer from './AddCustomer';
import TrainigList from './TrainigList';

class CustomerList extends Component {
    constructor(props) {
        super(props);
        this.state = {customers: [], training: []};

    }

    componentDidMount() {
        this.loadCustomers();

    }

    // Load customer section
    loadCustomers = () => {
        fetch('https://customerrest.herokuapp.com/api/customers')
            .then(response => response.json())
            .then(responseData => {
                this.setState({customers: responseData.content})
            })

    }

    // Add customer section
    addCustomer = (newCustomer) => {
        fetch('https://customerrest.herokuapp.com/api/customers',
            {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(newCustomer)
            })
            .then(
                toast.success("New customer is added successfully!"), {
                    position: toast.POSITION.BOTTOM_LEFT
                }
            )
            .then(respond => this.loadCustomers())
            .catch(error => console.error((error)))
    }

    // Delete customer section
    deleteCustomer = (value) => {
        console.log(value, "this is delete")
        confirmAlert({
            message: 'Delete this customer?',
            buttons: [
                {
                    label: 'Confirm',
                    onClick: () => fetch(value, {method: 'DELETE'})
                        .then(res => {
                                this.loadCustomers()
                                toast.success("The customer was deleted successfully!", {
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

    // Edit customer section
    EditCustomer(customer, link) {
        fetch(link,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(customer)
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
                    const data = [...this.state.customers];
                    data[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
                    this.setState({customers: data});
                }}
                dangerouslySetInnerHTML={{
                    __html: this.state.customers[cellInfo.index][cellInfo.column.id]
                }}
            />
        )
    }

    // Render sections 
    render() {


        return (

            <div className="container">
                <ToastContainer autoClose={3000}/>

                <div className="row">
                    <AddCustomer addCustomer={this.addCustomer}/>
                </div>

                <ReactTable
                    data={this.state.customers}
                    columns={[
                        {
                            columns: [
                                {
                                    Cell: ({value}) => (
                                        <button className="btn btn-warning" style={{margin: 10}} onClick={() => {
                                            this.loadTraining(value)
                                        }}>Fetch</button>),

                                    expander: true,
                                    Header: () => <p>Training</p>,
                                    width: 65,
                                    Expander: ({isExpanded, ...rest}) =>
                                        <div>
                                            {isExpanded
                                                ? <span>&#x2299;</span>
                                                : <span>&#x2295;</span>}
                                        </div>,
                                    style: {
                                        cursor: "pointer",
                                        fontSize: 25,
                                        padding: "0",
                                        textAlign: "center",
                                        userSelect: "none"
                                    }
                                }
                            ]
                        },
                        {
                            Header: "Name",
                            columns: [
                                {
                                    Header: "First name",
                                    accessor: "firstname",
                                    Cell: this.renderEditable
                                },
                                {
                                    Header: "Last name",
                                    accessor: "lastname",
                                    Cell: this.renderEditable
                                }
                            ]
                        },
                        {
                            Header: "Customer's information",
                            columns: [
                                {
                                    Header: "Street address",
                                    accessor: "streetaddress",
                                    Cell: this.renderEditable
                                },
                                {
                                    Header: "Postcode",
                                    accessor: "postcode",
                                    Cell: this.renderEditable
                                },
                                {
                                    Header: "City",
                                    accessor: "city",
                                    Cell: this.renderEditable
                                },
                                {
                                    Header: "Email",
                                    accessor: "email",
                                    Cell: this.renderEditable
                                },
                                {
                                    Header: "Phone",
                                    accessor: "phone",
                                    Cell: this.renderEditable
                                },
                                {
                                    id: 'button',
                                    sortable: false,
                                    filterable: false,
                                    width: 100,
                                    accessor: 'links.self.href',
                                    Cell: ({value, row}) => (
                                        <button className="btn btn-success" onClick={() => {
                                            this.EditCustomer(row, value)
                                        }}>Save</button>)
                                },
                                {
                                    id: "button",
                                    accessor: "links[1].href",
                                    filterable: false,
                                    sortable: false,
                                    width: 100,
                                    Cell: ({value}) => (
                                        <button className="btn btn-warning" onClick={() => {
                                            this.deleteCustomer(value)
                                        }}>Delete</button>)


                                }
                            ]
                        }]}
                    filterable
                    defaultPageSize={10}
                    freezeWhenExpanded={true}
                    SubComponent={row => {
                        return (
                            <div style={{padding: "20px"}}>
                                <TrainigList idLink={row.original.links[2].href} customerLink={row.original.links[1].href}/>

                            </div>
                        );


                    }}
                />

            </div>
        );
    }
}

export default CustomerList;