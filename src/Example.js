import React, { Component } from 'react';
import { Router, Route, Link } from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory'
import { Provider, connect } from 'react-redux';
import { withRouter, Redirect, Switch } from 'react-router-dom';
import { createStore, compose } from 'redux';
import _ from "lodash";

import lifecycle from './lifecycle';

// import { batchedSubscribe } from "redux-batched-subscribe";
// import { unstable_batchedUpdates } from "react-dom";

// Load extremely important images
import URL_IMG1 from './images/img1.jpg';
import URL_IMG2 from './images/img2.jpg';
import URL_IMG3 from './images/img3.jpg';

// Static page data
const PAGES = {
    "page-a": { title: "Hey now, what's all the ruckus?", img: URL_IMG1 },
    "page-b": { title: "Sassy", img: URL_IMG2 },
    "page-c": { title: "Bro, do you even lift?", img: URL_IMG3 },
};









const SET_PAGE = "SET_PAGE";

const setPage = (page) =>
    ({ type: SET_PAGE, payload: page });

const Store = createStore(
    (state, action) => {
        if (action.type === SET_PAGE) {
            state = PAGES[action.payload];
        }
        return state;
    },
    // batchedSubscribe(_.debounce(unstable_batchedUpdates))
);










class Page extends Component {
    /*static contextTypes = {
        page: React.PropTypes.object
    }*/

    render() {
        console.log("CHILD", this.props.page && this.props.page.title);

        const { title, img } = this.props.page;
        return (
            <div>
                <h1>{title}</h1>
                <img alt={title} src={img} />
            </div>
        );
    }
}

// Component composition
// connect provides { dispatch, page }
Page = connect(page => ({ page }))(Page);










class PageController extends Component {

    //static childContextTypes = { page: React.PropTypes.object }
    //getChildContext() { return { page: this.props.page }; }

    componentWillMount() {
        this.updatePage(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.match.params.page !== nextProps.match.params.page) {
            this.updatePage(nextProps);
        }
    }

    updatePage({ dispatch, match }) {
        dispatch(setPage(match.params.page));
    }

    render() {
        console.log("PARENT", this.props.page && this.props.page.title);

        if (this.props.page) {
            return <Page />;
        } else {
            return <h1>Please select a page</h1>;
        }
    }
}

// Component composition
// withRouter provides { match }
// connect provides { dispatch, page }
PageController = compose(
    withRouter,
    connect(page => ({ page }))
)(PageController);










class AlternativePageController extends Component {
    render() {
        console.log("PARENT", this.props.page && this.props.page.title);

        if (this.props.page) {
            return <Page />;
        } else {
            return <h1>Please select a page</h1>;
        }
    }
}

// Component composition
// withRouter provides { match, history }
// lifecycle performs transition dispatches
// connect provides { dispatch, page }
AlternativePageController = compose(
    withRouter,
    lifecycle({
        onMount(dispatch, props) {
            dispatch(setPage(props.match.params.page));
        },

        onUpdate(dispatch, props, nextProps) {
            if (props.match.params.page !== nextProps.match.params.page) {
                dispatch(setPage(nextProps.match.params.page));
            }
        }
    }),
    connect(page => ({ page }))
)(AlternativePageController);









const history = createBrowserHistory();
history.listen(() => console.log("---------- page changed ----------"));

export default class Example extends Component {
    renderNav(prefix) {
        return (
            <ul className="nav">
                <li><Link to={prefix}>Index</Link></li>
                {_.map(PAGES, (page, name) =>
                    <li key={name}>
                        <Link to={`${prefix}/${name}`}>{page.title}</Link>
                    </li>
                )}
            </ul>
        );
    }

    render() {
        return (
            <Provider store={Store}>
                <Router history={history}>
                    <Switch>
                        <Route path="/" exact>
                            <Redirect to="/basic" />
                        </Route>
                        <Route path="/basic">
                            <div className="Example">
                                {this.renderNav("/basic")}
                                <Route path="/basic/:page?" component={PageController} />
                            </div>
                        </Route>
                        <Route path="/alt">
                            <div className="Example">
                                {this.renderNav("/alt")}
                                <Route path="/alt/:page?" component={AlternativePageController} />
                            </div>
                        </Route>
                    </Switch>
                </Router>
            </Provider>
        );
    }
}
