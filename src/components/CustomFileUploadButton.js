import React from "react";
import styled from "styled-components";

const CustomFileUploadButton = ({ onChange }) => {
  const FileUploadLabel = styled.label`
    background-color: inherit;
    color: inherit;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
      text-underline-position: under;
      text-decoration-thickness: 1.5px;
    }
  `;

  return (
    <FileUploadLabel htmlFor="file-upload">
      <i className="fas fa-cloud-upload-alt"></i> Select an image for the
      deceased &nbsp;
      <input id="file-upload" type="file" onChange={onChange} hidden="hidden" />
    </FileUploadLabel>
  );
};

export default CustomFileUploadButton;
