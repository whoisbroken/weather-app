import styled from "styled-components";
import backgroundImg from "../assets/sunset.jpg";

export const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  position: relative;
  background-color: rgba(0, 0, 0, 0.4);
  color: #fff;

  &:before {
    content: "";
    background: url(${backgroundImg}) no-repeat center center/cover;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: -1;
  }
`;

export const FormContainer = styled.form`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  padding: 1rem;
`;

export const ToggleButton = styled.input`
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  width: 62px;
  height: 32px;
  margin-left: auto;
  display: inline-block;
  position: relative;
  border-radius: 50px;
  overflow: hidden;
  outline: none;
  border: none;
  cursor: pointer;
  background-color: #707070;
  transition: background-color ease 0.3s;

  &:before {
    content: "Fah Cel";
    display: block;
    position: absolute;
    z-index: 2;
    width: 28px;
    height: 28px;
    background: #fff;
    left: 2px;
    top: 2px;
    border-radius: 50%;
    font: 10px/28px Helvetica;
    text-transform: uppercase;
    font-weight: bold;
    text-indent: -22px;
    word-spacing: 37px;
    color: #fff;
    text-shadow: -1px -1px rgba(0, 0, 0, 0.15);
    white-space: nowrap;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    transition: all cubic-bezier(0.3, 1.5, 0.7, 1) 0.3s;
  }

  &:checked {
    background-color: #707070;
  }
  &:checked:before {
    left: 32px;
  }
`;

export const SearchInput = styled.input`
  padding: 0.7rem 1.5rem;
  font-size: 1.2rem;
  border-radius: 25px;
  border: 1px solid rgba(255, 255, 255, 0.8);
  background: rgba(255, 255, 255, 0.1);
  color: #f8f8f8;

  &::placeholder {
    color: #f8f8f8;
  }
`;

export const Button = styled.button`
  padding: 0.7rem 1.5rem;
  font-size: 1.2rem;
  border-radius: 25px;
  border: 1px solid rgba(255, 255, 255, 0.8);
  background: rgba(255, 255, 255, 0.1);
  color: #f8f8f8;

  &:hover {
    cursor: pointer;
    filter: brightness(0.85);
  }
`;

export const MainContainer = styled.div`
  max-width: 1000px;
  margin: auto;
  padding: 0 1rem;
  position: relative;
  top: 10%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

export const Text = styled.p`
  width: 100%;
  margin: 1rem auto;
`;

export const RotatedText = styled.p`
  position: relative;
  right: -97%;
  transform-origin: 0 0;
  transform: rotate(269deg);
`;

export const SecondaryContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
  text-align: center;
  flex-wrap: wrap;
  width: 100%;
  margin: 1rem auto;
  border-radius: 12px;
  background-color: rgba(255, 255, 255, 0.2);
`;
