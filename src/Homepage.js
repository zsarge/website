import React from "react";
import PropTypes from "prop-types";
import profilePicture from "./images/pfp.jpg";
import "./Homepage.css";

console.log(profilePicture);

/**
 * Represents the homepage for my website.
 * @return {element}
 */
function Homepage() {
	return (
		<div className="Homepage">
			<Navbar />
		</div>
	);
}

/**
 * Represents the navigation bar at the top of the screen.
 * This does not scroll with the page.
 * @return {element}
 */
function Navbar() {
	return (
		<div id="Navbar">
			<Logo />
			<NavLinkGroup />
		</div>
	);
}

/**
 * Represents my name/logo in the top left of the navbar
 * @return { string } - Currently just my name. Should be a logo in the future
 */
function Logo() {
	return (
		<div className="Logo">
			<CircularImage image={profilePicture} />
			Zack Sargent
		</div>
	);
}

/**
 * Takes an image and returns a circularly framed image.
 * This is used to correct for rectangular images.
 * https://medium.com/@biancapower/how-to-make-a-rectangle-image-a-circle-in-css-2f392bc9abd3
 * @param {string} props - image path
 * @return {element}
 */
function CircularImage(props) {
	return (
		<div className="image-cropper">
			<img src={props.image} alt="" className="picture" />
		</div>
	);
}
CircularImage.propTypes = {
	image: PropTypes.string.isRequired,
};

/**
 * Creates a group of links for the navigation bar
 * @return {element}
 */
function NavLinkGroup() {
	return (
		<div id="NavLinkGroup">
			<ul>
				<li>
					<NavLink name="Projects" link="https://www.example.com/" />
				</li>
				<li>
					<NavLink name="Blog" link="https://www.example.com/" />
				</li>
				<li>
					<NavLink name="About Me" link="https://www.example.com/" />
				</li>
			</ul>
		</div>
	)
}

/**
 * Creates a navigation link with a name and a link.
 * @param {object} props - name: string, link: string
 * @return {element}
 */
function NavLink(props) {
	return <a className="NavLink" href={props.link}> {props.name} </a>;
}
NavLink.propTypes = {
	name: PropTypes.string.isRequired,
	link: PropTypes.string.isRequired
};

export default Homepage;