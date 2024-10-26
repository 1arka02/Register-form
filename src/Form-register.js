import React, { useEffect, useState ,useRef} from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import isdCodes from './isd.js';
import './Form-register.css';

const RegisterForm = () => {


  const [timer, setTimer] = useState(0); // For countdown (in seconds)
  const [isDisabled, setIsDisabled] = useState(false); // To disable form fields
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [isRegistered, setIsRegistered] = useState(true);
  const [isOTP, setisOTP] = useState(false);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false); // New state to check if user is already registered
  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm();
  const navigate = useNavigate();
  const mobileValue = watch('mobile');
  const submitButtonRef = useRef(null); // Use ref for submit button
  const messageRef = useRef(null); // Use ref for the message

  


  // Email validation
  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) || "Invalid email address";
  };
  // Check if user is already registered
  const isAlreadyRegistered = (data) => {
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    return users.some(user => user.email === data.email && user.mobile === data.mobile && user.isd==data.isd && user.firstName==data.firstName && user.lastName==data.lastName && user.title==data.title);
  };
  // Handle form submission
  const onSubmit = (data) => {
    if (isAlreadyRegistered(data)) {
      setAlreadyRegistered(true);
      setisOTP(false);
      return;
    }
    setShowOtpInput(true);
    setisOTP(true);
    setAlreadyRegistered(false); // Reset if not already registered
    startTimer(60); // Start 60-second timer
  };
  // Function to start the countdown timer
  const startTimer = (duration) => {
    setTimer(duration);
    setIsDisabled(true); // Disable the form fields

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev === 1) {
          clearInterval(interval);
          setIsDisabled(false); // Re-enable form fields after the timer finishes
        }
        return prev - 1;
      });
    }, 1000);
  };
  
  const resend=()=>{
    startTimer(60);
  }

  const onSubmitOtp = (otpData) => {
    const lastSixDigits = mobileValue ? mobileValue.slice(-6) : '';

    if (otpData.otp === lastSixDigits) {
      setIsRegistered(true);

      const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const newUser = {
        firstName:watch('firstName'),
        lastName:watch('lastName'),
        title:watch('title'),
        isd: watch('isd'),
        email: watch('email'),
        mobile: watch('mobile'),
      };
      users.push(newUser);
      console.log(users);
      localStorage.setItem('registeredUsers', JSON.stringify(users)); // Store user data in localStorage
      navigate('/confirmation');
    } else {
      setIsRegistered(false);
    }
  };

  return (
    <div className='whole'>
      <div className='image-cover'>
        <img className='image22' src='https://slir.netlify.app/assets/sidePanel_new-iCiYVcEK.svg' />
      </div>
      <div className="register-form">
        <div className='img1'>
          <img src=" data:image/png;base64,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" className='image' />
        </div>
        <div className='expert'>
          <p>Register as an expert</p>
        </div>

        <form onSubmit={showOtpInput ? handleSubmit(onSubmitOtp) : handleSubmit(onSubmit)}>

          <div className='First'>
            <div className='Mr'>
              <select {...register('title', { required: true })} disabled={isDisabled}>
                <option value="Mr">Mr.</option>
                <option value="Mrs.">Mrs.</option>
                <option value="Miss">Miss</option>
                <option value="Mrs">Dr.</option>
                <option value="Mrs">Ms.</option>
                <option value="Mrs">Prof.</option>
              </select>
              {errors.title && <span>This field is required</span>}
            </div>

  
            <div className='First-name'>
              <input type="text" {...register('firstName', { required: true })} disabled={isDisabled} placeholder='First Name*' />
              {errors.firstName && <span>This field is required</span>}
            </div>


            <div className='Last-name'>
              <input type="text" {...register('lastName', { required: true })} disabled={isDisabled} placeholder='Last Name*' />
              {errors.lastName && <span>This field is required</span>}
            </div>
          </div>

          <div className='First'>
            <div className='ISD'>
              <select {...register('isd', { required: true })} disabled={isDisabled}>
                {isdCodes.map((code, index) => (
                  <option key={index} value={code.dialCode}>
                    {code.name} ({code.dialCode})
                  </option>
                ))}
              </select>
              {errors.isd && <span>This field is required</span>}
            </div>


            <div className='Mobile-Number'>
              <input type="text" {...register('mobile', { required: true })} disabled={isDisabled} placeholder='Mobile-number*' />
              {errors.mobile && <span>This field is required</span>}
            </div>
          </div>

          <div className='email-id'>
            <input
              type="email"
              {...register('email', { required: true, validate: validateEmail })}
              disabled={isDisabled}
              placeholder='Email-ID*'
            />
            {errors.email && <span>{errors.email.message}</span>}
          </div>
          {showOtpInput && (
            <div className='otp-input'>
              <input
                type="text"
                {...register('otp', { required: true, minLength: 6, maxLength: 6 })}
                placeholder="Enter OTP*"
              />
              {errors.otp && <span>OTP must be 6 digits</span>}
              <p>
  {timer > 0 ? (
    `Resend OTP in ${timer}s`
  ) : (
    <button className='resend' onClick={resend}>Resend OTP</button>
  )}
</p>
            </div>
          )}
         {alreadyRegistered ? (
            <p className="error-message">You are already registered with these credentials.</p>
          ) : (
            <button type="submit" ref={submitButtonRef}>{showOtpInput ? "Submit OTP" : "Get OTP from Email"}</button>
          )}
          <p>Already have an account? <a href="/login">Sign In</a></p>
        </form>
    </div>
  
          {
            isRegistered? ' ':
            <div className='Registered'> 
            <p className="error-message">Registration Failed!</p>
            </div>
          }
           {
            !isOTP? ' ':
            <div className='OTP'> 
            <p className="error-message">OTP Sent Successfully</p>
            </div>
          }

    <div>
    
        </div>
      </div>


   

  );
};

export default RegisterForm;