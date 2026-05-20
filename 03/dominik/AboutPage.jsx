import {Link} from "react-router";


export default function AboutPage() {
    return (
        <>
            <p>This is about page.</p>
            <Link to="/">Home page</Link>
            <Link to="/user/test">Test user page</Link>
        </>
    )
}