import React, {Component} from 'react';
import SkyLight from 'react-skylight';

class AddTraining extends Component {
    constructor(props) {
        super(props);
        this.state = {date: '', duration: '', activity: '', customer: ''}
    }

    handleChange = (event) => {
        this.setState({[event.target.name]: event.target.value})
    }
    handleSubmit = (event) => {
        event.preventDefault();
        console.log(this.props.customerLink)
        const newTraining = {
            date: this.state.date,
            activity: this.state.activity,
            duration: this.state.duration,
            customer: this.props.customerLink
        }
        this.props.addTraining(newTraining)
        this.simpleDialog.hide()
    }

    render() {
        return (
            <div>

                <SkyLight hideOnOverlayClicked ref={ref => this.simpleDialog = ref} title="Add new training activity">
                    <form>
                        <div className="form-group">

                            <input placeholder="Date" className="form-control" type="date" name="date"
                                   onChange={this.handleChange}/>
                        </div>
                        <div className="form-group">

                            <input placeholder="Duration" className="form-control" type="number" name="duration"
                                   onChange={this.handleChange}/>
                        </div>
                        <div className="form-group">

                            <input placeholder="Activity" className="form-control" type="text" name="activity"
                                   onChange={this.handleChange}/>
                        </div>


                        <button className="btn btn-outline-primary btn-sm" onClick={this.handleSubmit}>Add</button>
                    </form>
                </SkyLight>
                <button className="btn btn-outline-primary btn-sm" style={{margin: 10}}
                        onClick={() => this.simpleDialog.show()}>Add
                    new training activity
                </button>
            </div>
        );
    }
}


export default AddTraining;