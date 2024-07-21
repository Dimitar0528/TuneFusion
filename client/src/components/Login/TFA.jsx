import React, { useEffect, useState } from "react";
import styles from "./styles/TFA.module.css";
export default function TFAVerification() {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const email = localStorage.getItem("email");

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const sendOTP = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/auth/sendOTP", {
          signal: signal,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });

        if (response.ok) {
          const data = await response.json();
          localStorage.setItem("otp", data.otp);
          console.log(data.otp);
          alert(
            "A two-factor authentication (2FA) code has been sent to the provided email address! Please enter it in the input below and then click Verify my account buton in order to complete the verification!"
          );
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error(error);
        }
      }
    };

    sendOTP();

    return () => {
      controller.abort();
    };
  }, [email]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    if (element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const handlePaste = (event) => {
    const pasteData = event.clipboardData.getData("text");
    const pastedValues = pasteData.split("").slice(0, 6);

    const newOtp = [...otp];
    pastedValues.forEach((value, index) => {
      newOtp[index] = value;
    });
    setOtp(newOtp);

    console.log(newOtp.join(""));

    if (pastedValues.length === 6) {
      setTimeout(() => {
        handleSubmit();
      }, 400);
    }
  };

  const handleSubmit = async () => {
    const enteredOTP = otp.join("");
    const storedOTP = localStorage.getItem("otp");

    if (enteredOTP === storedOTP) {
      localStorage.removeItem("email");
      localStorage.removeItem("otp");
      location.href = "/sign-in";
    } else {
      alert("Incorrect OTP. Please try again.");
      console.log(otp);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Enter the provided 2FA code</h1>
      <div className={styles.otpField} onPaste={handlePaste}>
        {otp.map((data, index) => (
          <input
            key={index}
            type="text"
            maxLength="1"
            value={data}
            onChange={(e) => handleChange(e.target, index)}
            onKeyUp={(e) => {
              if (e.key === "Backspace" && otp[index] === "") {
                if (e.target.previousSibling) {
                  e.target.previousSibling.focus();
                }
              } else if (e.key === "ArrowLeft") {
                if (e.target.previousSibling) {
                  e.target.previousSibling.focus();
                }
              } else if (e.key === "ArrowRight") {
                if (e.target.nextSibling) {
                  e.target.nextSibling.focus();
                }
              } else if (e.key === "Enter") {
                handleSubmit();
              }
            }}
            className={styles.input}
          />
        ))}
      </div>
      <button onClick={handleSubmit} className={styles.button}>
        Verify my account
      </button>
    </div>
  );
}
