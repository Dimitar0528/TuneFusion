import React, { useEffect, useState } from "react";

export default function TFAVerification() {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const email = localStorage.getItem("email");

  useEffect(() => {
    let isMounted = true;

    const sendOTP = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/auth/sendOTP", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });

        if (isMounted) {
          if (response.ok) {
            const data = await response.json();
            localStorage.setItem("otp", data.otp);
            console.log(data.otp);
            alert(
              "A two-factor authentication (2FA) token has been sent to the provided email address for verification! Please enter it in the input below."
            );
          }
        }
      } catch (error) {
        if (isMounted) {
          console.error(error);
        }
      }
    };

    sendOTP();

    return () => {
      isMounted = false;
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
    <div style={styles.container}>
      <h1 style={styles.heading}>Enter 2FA code</h1>
      <div style={styles.otpField} onPaste={handlePaste}>
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
            style={styles.input}
          />
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    margin: 0,
    fontFamily: "Poppins, sans-serif",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    backgroundColor: "#282a36",
    height: "100vh",
    color: "#fff",
  },
  heading: {
    marginBottom: "1rem",
  },
  otpField: {
    display: "flex",
  },
  input: {
    width: "2.5rem",
    fontSize: "32px",
    padding: "10px",
    textAlign: "center",
    borderRadius: "5px",
    margin: "2px",
    border: "2px solid #55525c",
    backgroundColor: "#21232d",
    fontWeight: "bold",
    color: "#fff",
    outline: "none",
    transition: "all 0.1s",
  },
};
