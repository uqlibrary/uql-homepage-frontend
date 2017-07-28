import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardText, CardHeader } from 'material-ui/Card';
import { publicationYearsBig as publicationYearsMockData } from '../../../mock/data/academic/publicationYears';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import AuthorsPublicationsCount from '../../DonutChart/components/AuthorsPublicationsCount';
import { AuthorsPublicationsPerYearChart } from 'uqlibrary-react-toolbox';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';

// Dashboard sub-components
import DashboardArticleCount from 'modules/Dashboard/components/DashboardArticleCount';
import DashboardAccountDetails from 'modules/Dashboard/components/DashboardAccountDetails';

class Dashboard extends React.Component {

    static propTypes = {
        account: PropTypes.object.isRequired,
        history: PropTypes.object,
        loadUsersPublications: PropTypes.func,
        claimPublicationResults: PropTypes.object
    };

    constructor(props) {
        super(props);

        this.state = {
            showAppbar: true
        };
    }

    componentDidMount() {
        // fetch data to display here
        this.props.loadUsersPublications(123);
    }

    hideAppBar = () => {
        this.setState({showAppbar: false});
    };

    claimYourPublications = () => {
        this.props.history.push('/claim-publications');
    };

    render() {
        const {
            account
        } = this.props;

        return (
          <div className="layout-fill">
              <div className="layout-card">
                  <div className="columns is-multiline is-gapless">

                      <div className="column is-12 is-hidden-mobile">
                          <div className="image-cover">
                              <div className="columns is-gapless">
                                  <div className="column">
                                      <DashboardAccountDetails account={account} />
                                  </div>
                                  <div className="articleCountColumn column is-narrow">
                                      <DashboardArticleCount />
                                  </div>
                              </div>
                          </div>
                      </div>

                      <div className="notification-wrap column is-12">
                          {this.props.claimPublicationResults.size > 0 && this.state.showAppbar && (
                            <div className="warning alertWrapper">
                                <div className="columns">
                                    <div className="column is-narrow alertIcon">
                                        <FontIcon className="material-icons">warning</FontIcon>
                                    </div>
                                    <div className="column alertText">
                                        {`We have found ${this.props.claimPublicationResults.size} article(s) that could possibly be your work.`}
                                    </div>
                                    <div className="column is-narrow claim-button">
                                        <FlatButton label="Claim your publications now"
                                                    onTouchTap={this.claimYourPublications}
                                                    className="claim-publications"/>
                                    </div>
                                    <div className="column is-narrow is-hidden-mobile">
                                        <IconButton onTouchTap={this.hideAppBar}><NavigationClose
                                          className="hide-appbar"/></IconButton>
                                    </div>
                                </div>
                            </div> )}
                      </div>
                  </div>

                  <div className="columns">
                      <div className="column">
                          <Card style={{backgroundColor: '#36B6D6'}}>
                              <CardHeader className="card-header">
                                  <h2 className="title is-4 color-reverse">eSpace publications by year</h2>
                              </CardHeader>

                              <CardText className="body-1">
                                  <AuthorsPublicationsPerYearChart rawData={publicationYearsMockData}
                                                                   yAxisTitle="Total publications"/>
                              </CardText>
                          </Card>
                      </div>
                  </div>

                  <div className="columns">
                      <div className="column is-4">
                          <Card style={{backgroundColor: '#ed5c8f'}}>
                              <CardHeader className="card-header">
                                  <h2 className="title is-4 color-reverse">Document types overview</h2>
                              </CardHeader>

                              <CardText className="body-1">
                                  <AuthorsPublicationsCount/>
                              </CardText>
                          </Card>
                      </div>
                      <div className="column">
                          <Card style={{height: '100%'}}>
                              <Table className="linkedPubsTable" selectable="false">
                                  <TableHeader adjustForCheckbox="false">
                                      <TableRow>
                                          <TableHeaderColumn>eSpace publications linked from:</TableHeaderColumn>
                                          <TableHeaderColumn>Web of Science</TableHeaderColumn>
                                          <TableHeaderColumn>Scopus</TableHeaderColumn>
                                      </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                      <TableRow>
                                          <TableRowColumn>h-index score</TableRowColumn>
                                          <TableRowColumn>1</TableRowColumn>
                                          <TableRowColumn>2</TableRowColumn>
                                      </TableRow>
                                      <TableRow>
                                          <TableRowColumn>Average citation count per publication</TableRowColumn>
                                          <TableRowColumn>3</TableRowColumn>
                                          <TableRowColumn>4</TableRowColumn>
                                      </TableRow>
                                      <TableRow>
                                          <TableRowColumn>Total citations</TableRowColumn>
                                          <TableRowColumn>5</TableRowColumn>
                                          <TableRowColumn>6</TableRowColumn>
                                      </TableRow>
                                      <TableRow>
                                          <TableRowColumn>Total Publications</TableRowColumn>
                                          <TableRowColumn>7</TableRowColumn>
                                          <TableRowColumn>8</TableRowColumn>
                                      </TableRow>
                                      <TableRow>
                                          <TableRowColumn>Publication range</TableRowColumn>
                                          <TableRowColumn>9</TableRowColumn>
                                          <TableRowColumn>10</TableRowColumn>
                                      </TableRow>
                                  </TableBody>
                              </Table>
                          </Card>
                      </div>
                  </div>
              </div>
          </div>
        );
    }
}

export default Dashboard;
