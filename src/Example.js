import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { Provider, connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { createStore } from 'redux';
import _ from "lodash";

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
        console.log("CHILD", this.props.page);

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
        this.props.history.listen(() => console.log("---------- page changed ----------"));

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
        console.log("PARENT", this.props.page);

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
PageController = withRouter(
    connect(page => ({ page }))(
        PageController));







export default class Example extends Component {
    render() {
        return (
            <Provider store={Store}>
                <Router>
                    <div className="Example">
                        <ul className="nav">
                            <li><Link to="/">Index</Link></li>
                            {_.map(PAGES, (page, name) =>
                                <li key={name}>
                                    <Link to={`/${name}`}>{page.title}</Link>
                                </li>
                            )}
                        </ul>
                        <Route path="/:page?" component={PageController} />
                    </div>
                </Router>
            </Provider>
        );
    }
}
