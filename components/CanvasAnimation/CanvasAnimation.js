

'use client'; // Ensure this component runs on the client side

import React, { useEffect, useRef } from 'react';
import './CanvasAnimation.css'; // Import the CSS for styling

const CanvasAnimation = () => {
  const circlesRef = useRef([]);
  const coords = useRef({ x: 0, y: 0 }); // Using useRef for mutable values
  const timeoutRef = useRef(null); // To manage timeout for hiding circles
  const colors = Array(22).fill("#000000"); // Black color
//   // const colors = [
//   //   "#ffb56b", "#fdaf69", "#f89d63", "#f59761", "#ef865e",
//   //   "#ec805d", "#e36e5c", "#df685c", "#d5585c", "#d1525c",
//   //   "#c5415d", "#c03b5d", "#b22c5e", "#ac265e", "#9c155f",
//   //   "#950f5f", "#830060", "#7c0060", "#680060", "#60005f",
//   //   "#48005f", "#3d005e"
//   // ];
  useEffect(() => {
    const circles = circlesRef.current;

    // Initialize circle properties
    circles.forEach((circle, index) => {
      if (circle) {
        circle.x = 0;
        circle.y = 0;
        circle.style.backgroundColor = colors[index % colors.length];
        circle.style.opacity = 0; // Initially set to transparent
      }
    });

    const handleMouseMove = (e) => {
      coords.current.x = e.clientX;
      coords.current.y = e.clientY;

      // Show circles on mouse move
      circles.forEach(circle => {
        if (circle) {
          circle.style.opacity = 1; // Make circles visible
        }
      });

      // Clear the timeout if mouse is moving
      clearTimeout(timeoutRef.current);

      // Set a timeout to hide circles after 200ms of inactivity
      timeoutRef.current = setTimeout(() => {
        circles.forEach(circle => {
          if (circle) {
            circle.style.opacity = 0; // Make circles invisible
          }
        });
      }, 100); // Adjust the timeout duration as needed
    };

    const animateCircles = () => {
      let x = coords.current.x;
      let y = coords.current.y;

      circles.forEach((circle, index) => {
        if (!circle) return;

        circle.style.left = `${x - 12}px`;
        circle.style.top = `${y - 12}px`;
        circle.style.transform = `scale(${(circles.length - index) / circles.length})`;

        circle.x = x;
        circle.y = y;

        const nextCircle = circles[index + 1] || circles[0];
        x += (nextCircle.x - x) * 0.3;
        y += (nextCircle.y - y) * 0.3;
      });

      requestAnimationFrame(animateCircles);
    };

    // Start animation loop
    animateCircles();

    // Add event listener for mousemove
    window.addEventListener('mousemove', handleMouseMove);

    // Cleanup event listener and timeout when component unmounts
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeoutRef.current); // Clear the timeout if the component unmounts
    };
  }, [colors]); // Empty array so it only runs once on mount

  return (
    <div className="circle-container">
      {Array(22).fill().map((_, index) => (
        <div
          key={index}
          ref={(el) => circlesRef.current[index] = el}
          className="circle"
        />
      ))}
    </div>
  );
};

export default CanvasAnimation;
