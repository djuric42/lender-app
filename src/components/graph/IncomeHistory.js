import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Alert, ImageBackground, StyleSheet, View, Image, Text, TouchableOpacity, AsyncStorage, Animated } from 'react-native'
import { Form, Input, Item, Label, Content, Container } from 'native-base'
import { NavigationActions } from 'react-navigation'
import { Font } from 'expo';

class IncomeHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }

    this.refreshTransactionsInterval = null
  }
  async componentDidMount() {
    const { fetchTransactionsHistory, walletAddress } = this.props

    await Font.loadAsync({
      'barlow-semi-bold': require('../../../assets/fonts/Barlow-SemiBold.otf'),
    });
    await Font.loadAsync({
      'barlow-light': require('../../../assets/fonts/Barlow-Light.otf'),
    });
    await Font.loadAsync({
      'barlow': require('../../../assets/fonts/Barlow-Regular.otf'),
    });
    this.setState({ fontLoaded: true });

    // refresheshing transactions every 60s
    fetchTransactionsHistory(walletAddress);
    this.refreshTransactionsInterval = setInterval(() => {
      fetchTransactionsHistory(walletAddress);
    }, 60000)
  }

  componentWillUnmount() {
    console.log('clearing interval')
    clearInterval(this.refreshTransactionsInterval)
  }

  handleTransacationPress(transaction) {
    const { navigation, setActiveTransaction } = this.props
    setActiveTransaction(transaction)
    navigation.navigate('HistoryDetail')
  }

  renderTransaction(t) {
    const { walletAddress } = this.props

    if (!t.isDegreeTransaction) {
      return (
        <TouchableOpacity key={ t.hash } style={styles.tableRow} onPress={() => this.handleTransacationPress(t) }>
          <View>
            <Image source={require('../../../assets/images/icon-etherium.png')} style={styles.icon} />
          </View>
          <View style={styles.value}>
            { this.state.fontLoaded ? (<Text style={[styles.valueText, { fontFamily: 'barlow-semi-bold' }]}>{ t.ethValue } ETH</Text>) : null }
          </View>
          { t.to === walletAddress ? (
            <View style={[styles.status, styles.greenStatus]}>
              { this.state.fontLoaded ? (<Text style={[styles.statusText, styles.greenText, { fontFamily: 'barlow' }]}>RECEIVED</Text>) : null }
            </View>
          ) : (
            <View style={[styles.status, styles.orangeStatus]}>
              { this.state.fontLoaded ? (<Text style={[styles.statusText, styles.orangeText, { fontFamily: 'barlow' }]}>SOLD</Text>) : null }
            </View>
          )}
          <View style={styles.created}>
            { this.state.fontLoaded ? (<Text style={[styles.createdText, { fontFamily: 'barlow' }]}>{ t.dateDisplay }</Text>) : null }
            <Image source={require('../../../assets/images/icon-time.png')} style={styles.clock} />
            { this.state.fontLoaded ? (<Text style={[styles.createdText, { fontFamily: 'barlow' }]}>{ t.timeDisplay }</Text>) : null }
          </View>
        </TouchableOpacity>
      )
    } else {
      return (
        <TouchableOpacity key={ t.hash } style={[styles.tableRow]} onPress={() => this.handleTransacationPress(t) }>
          <View>
            <Image source={require('../../../assets/images/icon-coins.png')} style={styles.icon} />
          </View>
          <View style={styles.value}>
            { this.state.fontLoaded ? (<Text style={[styles.valueText, { fontFamily: 'barlow-semi-bold' }]}>{ t.degAmount } CEL</Text>) : null }
          </View>
          { t.to === walletAddress ? (
            <View style={[styles.status, styles.greenStatus]}>
              { this.state.fontLoaded ? (<Text style={[styles.statusText, styles.greenText, { fontFamily: 'barlow' }]}>RECEIVED</Text>) : null }
            </View>
          ) : (
            <View style={[styles.status, styles.orangeStatus]}>
              { this.state.fontLoaded ? (<Text style={[styles.statusText, styles.orangeText, { fontFamily: 'barlow' }]}>SOLD</Text>) : null }
            </View>
          )}
          <View style={styles.created}>
            { this.state.fontLoaded ? (<Text style={[styles.createdText, { fontFamily: 'barlow' }]}>{ t.dateDisplay }</Text>) : null }
            <Image source={require('../../../assets/images/icon-time.png')} style={styles.clock} />
            { this.state.fontLoaded ? (<Text style={[styles.createdText, { fontFamily: 'barlow' }]}>{ t.timeDisplay }</Text>) : null }
          </View>
        </TouchableOpacity>
      )
    }

    return null
  }

  render () {
    const { navigate } = this.props.navigation
    const { transactions } = this.props

    console.log(transactions)

    return (
      <View style={styles.welcomeContainer}>
        <Container style={styles.wrapper}>
          <Content>

            {/* <Text style={styles.header}>
              { this.state.fontLoaded ? (<Text style={[{ fontFamily: 'barlow-semi-bold' }]}>{ this.state.eth.toFixed(3) }</Text>) : null }
              { this.state.fontLoaded ? (<Text style={[{ fontFamily: 'barlow-semi-bold' }]}> ETH</Text>) : null }
            </Text>
            <Text style={styles.header2}>
              { this.state.fontLoaded ? (<Text style={[{ fontFamily: 'barlow-light' }]}>{ this.state.deg.toFixed(3) }</Text>) : null }
              { this.state.fontLoaded ? (<Text style={[{ fontFamily: 'barlow-light' }]}> CEL</Text>) : null }
              { this.state.fontLoaded ? (<Text style={[ styles.changeUp, { fontFamily: 'barlow-light' }]}> { this.state.change}</Text>) : null }
            </Text> */}

            {/* <View style={styles.row}>
              <View style={styles.cellLeft}>
                <TouchableOpacity style={styles.button} onPress={() => navigate('AddFounds')}>
                  <Text style={styles.buttonText}>Add funds</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.cellRight}>
                <TouchableOpacity style={styles.button2} onPress={() => navigate('Graph')}>
                  <Text style={styles.button2Text}>Manage</Text>
                </TouchableOpacity>
              </View>
            </View> */}
            <View style={styles.tableWrapper}>
              { transactions.map((t) => this.renderTransaction(t))}
            </View>
            <Text style={[styles.footer, {marginBottom: 50}]}>
              { this.state.fontLoaded ? (<Text style={[{ fontFamily: 'barlow' }]}>Income history</Text>) : null }
            </Text>
          </Content>
        </Container>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  welcomeContainer: {
    flex: 1
  },
  header: {
		fontSize: 42,
		backgroundColor: 'rgba(0,0,0,0)',
		color: 'white',
		paddingLeft: 30,
		paddingRight: 30,
		marginBottom: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20
  },
  row: {
    height: 140,
    flexDirection: 'row',
  },
  header2: {
		fontSize: 24,
		backgroundColor: 'rgba(0,0,0,0)',
		color: '#9CA9B6',
		paddingLeft: 30,
		paddingRight: 30,
		marginBottom: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 0
  },
  changeUp: {
    fontSize: 18,
    color: '#47CA53'
  },
  changeDown: {
    fontSize: 18,
    color: '#ff3333'
  },
  cellLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginLeft: 10,
    // height: 40,
    // borderWidth: 1,
    // borderColor: 'green',
  },
  cellRight: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginRight: 10,
    // height: 40,
    // borderWidth: 1,
    // borderColor: 'red'
  },
  button: {
    backgroundColor: '#ffffff',
    borderRadius: 5,
    padding: 5,
    height: 50,
    // width: 150,
    justifyContent: 'center',
    alignItems: 'center',
    // marginRight: '5%',
    // marginLeft: '5%',
    paddingLeft: 20,
    paddingRight: 20,
    marginLeft: 30,
  },
  buttonText: {
    color: '#333333',
    fontSize: 20
  },
  button2: {
    backgroundColor: 'rgba(255, 255, 255, 0.0)',
    borderColor: 'rgba(255, 255, 255, 0.5)',
    borderWidth: 2,
    borderRadius: 5,
    padding: 5,
    height: 50,
    // width: 150,
    justifyContent: 'center',
    alignItems: 'center',
    // marginRight: '5%',
    // marginLeft: '5%',
    paddingLeft: 20,
    paddingRight: 20,
    marginRight: 30,
  },
  button2Text: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 20
  },
  graphWrapper: {
    flex: 1,
    alignItems: 'center',
    paddingLeft: 30,
    paddingRight: 30,
    // borderWidth: 1,
    // borderColor: 'blue'

  },
  tableContainer: {
    flex: 1,
    // flexDirection: 'row',
    // width: '100%',
    height: 340,
    // resizeMode: "contain",
    marginLeft: 20,
    marginRight: 20,
    // borderWidth: 1,
    // borderColor: 'red'
  },
  footer: {
		fontSize: 24,
		backgroundColor: 'rgba(0,0,0,0)',
		color: '#ffffff',
		paddingLeft: 30,
		paddingRight: 30,
		marginBottom: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 0
  },
  tableRow: {
    height: 82,
    borderBottomWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    position: 'relative'
  },
  value: {
    position: 'absolute',
    top: 10,
    left: 50,
  },
  valueText: {
    color: '#ffffff',
    fontSize: 21,
  },
  icon: {
    width: 40,
    height: 40,
    resizeMode: "contain",
    marginLeft: 0,
    marginTop: 20
  },
  status: {
    position: 'absolute',
    top: 45,
    left: 40,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 20,
    paddingTop: 0,
    paddingBottom: 2,
    paddingLeft: 15,
    paddingRight: 15,
  },
  statusText: {
    color: '#ffffff',
    fontSize: 14,
  },
  created: {
    position: 'absolute',
    right: 0,
    bottom: 5,
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    flexDirection:'row',
    // borderWidth: 1,
    // borderColor: 'red',
    width: '50%',
  },
  clock: {
    width: 14,
    height: 14,
    resizeMode: "contain",
    flexDirection:'column',
    marginLeft: 10,
    marginRight: 3,
    marginTop: 3
  },
  createdText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 13,
    flexDirection:'column',
  },
  greenStatus: {
    borderColor: '#47CA53'
  },
  greenText: {
    color: '#47CA53'
  },
  orangeStatus: {
    borderColor: '#E19F30'
  },
  orangeText: {
    borderColor: '#E19F30'
  }
})

const mapStateToProps = state => {
  return {
  }
}

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(IncomeHistory)
