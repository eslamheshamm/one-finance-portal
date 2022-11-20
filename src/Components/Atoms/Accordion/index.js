import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const SideBarAccordion = ({ title, content, icon }) => {
	const [expanded, setExpanded] = useState(false);
	const backgroundVarient = {
		open: {
			backgroundColor: "#222222",
		},
		closed: {
			backgroundColor: "",
		},
	};
	const titleVariantes = {
		open: {
			color: "#EDAA00",
			fontWeight: "700",
		},
		closed: {
			color: "white",
			fontWeight: "700",
		},
	};
	const arrowVarients = {
		open: {
			rotate: 180,
			backgroundColor: "#EDAA00",
			color: "black",
		},
		closed: {
			rotate: 0,
			color: "black",
			backgroundColor: "white",
		},
	};
	const iconVariantes = {
		open: {
			color: "#EDAA00",
		},
		closed: {
			color: "white",
		},
	};

	return (
		<div className=" last:mb-0  rounded-3xl">
			<motion.div
				onClick={() => setExpanded(!expanded)}
				className="cursor-pointer flex justify-between w-full items-center  mb-4   p-3 rounded-2xl"
				animate={expanded ? "open" : "closed"}
				variants={backgroundVarient}
				transition={{ duration: 0.4 }}
				initial="closed"
			>
				<div className="flex items-center">
					{icon && (
						<motion.div
							animate={expanded ? "open" : "closed"}
							variants={iconVariantes}
							transition={{ duration: 0.4 }}
							initial="closed"
							className="ml-3"
						>
							{icon}
						</motion.div>
					)}{" "}
					<motion.p
						animate={expanded ? "open" : "closed"}
						variants={titleVariantes}
						transition={{ duration: 0.4 }}
						initial="closed"
						className="text-xl  "
					>
						{title}
					</motion.p>
				</div>
				<motion.button
					animate={expanded ? "open" : "closed"}
					variants={arrowVarients}
					transition={{ duration: 0.4 }}
					initial="closed"
					className="w-6 h-6 flex items-center justify-center   text-white rounded-full"
				>
					<span>{Arrow}</span>
				</motion.button>
			</motion.div>
			<AnimatePresence initial={false}>
				{expanded && (
					<motion.div
						key="content"
						initial="collapsed"
						animate="open"
						exit="collapsed"
						variants={{
							open: { opacity: 1, height: "auto" },
							collapsed: { opacity: 0, height: 0 },
						}}
						transition={{ duration: 0.8, ease: [0.04, 0.62, 0.23, 0.98] }}
						className="px-10 "
					>
						{content}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

const Arrow = (
	<svg
		width="28"
		height="15"
		viewBox="0 0 28 15"
		className="w-3 h-3"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M25.5439 1.66675L13.9387 13.272L2.33338 1.66675"
			stroke="currentColor"
			strokeWidth="3"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);
