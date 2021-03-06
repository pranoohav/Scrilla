import * as React from 'react';
import { Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Parse from 'parse';
import { AsyncStorage } from 'react-native';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { updateName, updateEmail, updatePassword, signup, updateAlerts } from '../actions/user';
import { Icon } from 'react-native-elements';

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ updateEmail, updatePassword, updateName, signup, updateAlerts }, dispatch)
}

const mapStateToProps = state => {
    return {
        user: state.user
    }
}


class TransactionHistoryScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            keptArrayVals: [],
            returnedArrayVals: [],
            moneySaved: 0
        }
    }

    intervalID = null;

    componentDidMount() {
        this.intervalID = setInterval(this.updateBoth.bind(this), 1000);
        this.updateBoth();
    }

    componentWillUnmount() {
        clearInterval(this.intervalID)
    }

    updateBoth() {
        this.updateReturned();
        this.updateKept();
    }

    updateReturned() {
        const Transactions = Parse.Object.extend("Transactions");
        const query = new Parse.Query(Transactions);
        let arrayVals = []
        let money = 0

        query.equalTo("username", String(this.props.user.username))
        query.equalTo("status", "returned")
        
        query.find().then(results => {
            results.forEach((obj, key) => {
            money = money + parseInt(obj.get('price').substr(1, 10))
            arrayVals.push(
                <View  style = {{padding: 10}}>
                <View style = {{borderRadius: 10, padding: 13, backgroundColor: "#C6C8CC", width: 330, height: 100, alignItems: 'center'}}>
                <Text style = {{color: "#3163B0", fontWeight: "bold"}}>
                    Store: {obj.get('store')}  
                </Text>
                <Text style = {{color: "#3163B0", fontWeight: "bold"}}>
                    Item: {obj.get('item')}
                </Text>
                <Text style = {{color: "#3163B0", fontWeight: "bold"}}>
                    Price: {obj.get('price')}
                </Text>
                <Text style = {{color: "#3163B0", fontWeight: "bold"}}>
                    Return Date: {obj.get('returnDate')}
                </Text>
                </View>
                </View>)}
            )
        }).then(() => 
        {
            this.setState({returnedArrayVals: arrayVals})
            this.setState({moneySaved: money})
        });
    }

    updateKept() {
        const Transactions = Parse.Object.extend("Transactions");
        const query = new Parse.Query(Transactions);
        let arrayVals = []

        query.equalTo("username", String(this.props.user.username))
        query.equalTo("status", "kept")
        
        query.find().then(results => {
            results.forEach((obj, key) => {
            arrayVals.push(
                <View  style = {{padding: 10}}>
                <View style = {{borderRadius: 10, padding: 13, backgroundColor: "#C6C8CC", width: 330, height: 100, alignItems: 'center'}}>
                <Text style = {{color: "#3163B0", fontWeight: "bold"}}>
                    Store: {obj.get('store')}  
                </Text>
                <Text style = {{color: "#3163B0", fontWeight: "bold"}}>
                    Item: {obj.get('item')}
                </Text>
                <Text style = {{color: "#3163B0", fontWeight: "bold"}}>
                    Price: {obj.get('price')}
                </Text>
                <Text style = {{color: "#3163B0", fontWeight: "bold"}}>
                    Return Date: {obj.get('returnDate')}
                </Text>
                </View>
                </View>)}
            )
        }).then(() => 
        {this.setState({keptArrayVals: arrayVals})});
    }

    render() {
        return (
            <KeyboardAwareScrollView
            resetScrollToCoords={{ x: 0, y: 0 }}
            scrollEnabled={true}>
                <View style = {{alignItems: 'center', paddingTop: 60, paddingBottom: 15}}>
                    <Text style = {{paddingBottom: 25, color: "#3163B0", fontSize: 36, fontWeight: "bold", fontFamily: "Avenir"}}>Transaction History</Text>
                    <Text style = {{fontSize: 15}}>TOTAL MONEY SAVED: ${this.state.moneySaved}</Text>
                </View>
                <View style = {{alignItems: 'center', paddingTop: 10}}>
                    <View style = {{paddingBottom: 15}}>
                        <Text style = {{fontSize: 20, fontFamily: "Avenir", color: "#3163B0", fontWeight: "bold"}}>RETURNED</Text>
                    </View>
                    {this.state.returnedArrayVals.length == 0 ? <Text>You have not returned any items so far.</Text> : this.state.returnedArrayVals}
                </View>
                <View style = {{alignItems: 'center', paddingTop: 20}}>
                    <View style = {{paddingBottom: 15}}>
                        <Text style = {{fontSize: 20, fontFamily: "Avenir", color: "#3163B0", fontWeight: "bold"}}>KEPT</Text>
                    </View>
                    {this.state.keptArrayVals.length == 0 ? <Text>You have not kept any items so far.</Text> : this.state.keptArrayVals}
                </View>
            </KeyboardAwareScrollView>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TransactionHistoryScreen)