import React, { useRef, useEffect } from "react";
import "./styles/ContactUs.css";

export default function ContactUs() {
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const phoneRef = useRef(null);
  const messageRef = useRef(null);

  const focusFunc = (event) => {
    let parent = event.target.parentNode;
    parent.classList.add("focus");
  };

  const blurFunc = (event) => {
    let parent = event.target.parentNode;
    if (event.target.value === "") {
      parent.classList.remove("focus");
    }
  };

  useEffect(() => {
    const inputs = [
      nameRef.current,
      emailRef.current,
      phoneRef.current,
      messageRef.current,
    ];

    inputs.forEach((input) => {
      input.addEventListener("focus", focusFunc);
      input.addEventListener("blur", blurFunc);
    });

    // Cleanup function to remove event listeners
    return () => {
      inputs.forEach((input) => {
        input.removeEventListener("focus", focusFunc);
        input.removeEventListener("blur", blurFunc);
      });
    };
  }, []);

  return (
    <div className="container">
      <span className="big-circle"></span>
      <img src="img/shape.png" className="square" alt="" />
      <div className="form">
        <div className="contact-info">
          <h3 className="title">Let's Connect with TuneFusion</h3>
          <p className="text">
            Have questions or feedback? Reach out to us! We're here to help anytime.
          </p>
          <div className="info">
            <div className="information">
              <img src="/assets/location.png" className="icon" alt="" />
              <p>92 Cherry Drive Uniondale, NY 11553</p>
            </div>
            <div className="information">
              <img src="/assets/email.png" className="icon" alt="" />
              <p>support@tunefusion.com</p>
            </div>
            <div className="information">
              <img src="/assets/phone.png" className="icon" alt="" />
              <p>123-456-789</p>
            </div>
          </div>
          <div className="social-media">
            <p>Connect with TuneFusion:</p>
            <div className="social-icons">
              <a href="#">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>
        </div>
        <div className="contact-form">
          <span className="circle one"></span>
          <span className="circle two"></span>
          <form action="index.html" autoComplete="off">
            <h3 className="title">Send us a Message</h3>
            <div className="input-container">
              <input type="text" name="name" className="input" ref={nameRef} />
              <label htmlFor="">Your Name</label>
              <span>Your Name</span>
            </div>
            <div className="input-container">
              <input
                type="email"
                name="email"
                className="input"
                ref={emailRef}
              />
              <label htmlFor="">Your Email</label>
              <span>Your Email</span>
            </div>
            <div className="input-container">
              <input type="tel" name="phone" className="input" ref={phoneRef} />
              <label htmlFor="">Your Phone</label>
              <span>Your Phone</span>
            </div>
            <div className="input-container textarea">
              <textarea
                name="message"
                className="input"
                ref={messageRef}></textarea>
              <label htmlFor="">Your Message</label>
              <span>Your Message</span>
            </div>
            <input type="submit" value="Send" className="btn" />
          </form>
        </div>
      </div>
    </div>
  );
}
