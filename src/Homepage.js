import React, { useLayoutEffect, useState } from "react";
import PropTypes from "prop-types";
import profilePicture from "./images/pfp.jpg";
import "./Homepage.css";

/**
 * Represents the homepage for my website.
 * @return { element }
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
 * @return { element } Logo and NavLinkGroup
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
 * @return { Element } Picture, name, and subtitle
 */
function Logo() {
	return (
		<div className="Logo">
			<CircularImage image={profilePicture} />
			<PersonalText />
		</div>
	);
}

/**
 * My name and a description below my name
 * @return { element }
 */
function PersonalText() {
	return (
		<div className="PersonalText">
			<div className="MyName">
				Zack Sargent
			</div>
			<div className="AboutMe">
				Lorem ipsum dolor sit amet
			</div>
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
		<div className="ImageCropper">
			<img src={props.image} alt="" className="Picture" />
		</div>
	);
}
CircularImage.propTypes = {
	image: PropTypes.string.isRequired,
};

/**
 * useWindowSize uses the latest window width.
 * @return {array} width, height
 */
function useWindowSize() {
	const [size, setSize] = useState([0, 0]);
	useLayoutEffect(() => {
		// eslint-disable-next-line require-jsdoc
		function updateSize() {
			setSize([window.innerWidth, window.innerHeight]);
		}
		window.addEventListener("resize", updateSize);
		updateSize();
		return () => window.removeEventListener("resize", updateSize);
	}, []);
	return size;
}

/**
 * useWindowWidth uses the width from useWindowSize
 * @return {number} width
 */
function useWindowWidth() {
	return useWindowSize()[0];
}

/**
 * Creates a group of links for the navigation bar.
 * The links will be side by side on desktop, and
 * in a hamburger menu on mobile.
 * @return { element }
 */
function NavLinkGroup() {
	const width = useWindowWidth();
	console.log(width);
	if (width < 600) {
		// TODO - Add hamburger menu
		return <> hamburger icon </>;
	} else {
		return <NavLinkList />;
	}
}

/**
 * NavLinkList returns an unordered list of links for
 * the top right of the nav bar
 * @return {element}
 */
function NavLinkList() {
	return (
		<div id="NavLinkGroup" >
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
	);
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
