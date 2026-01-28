import styled from 'styled-components';

import { darkText, offWhite } from 'colors';

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;

  label {
    font-size: 14px;
    margin-bottom: 4px;
  }

  input,
  textarea {
    background: ${offWhite};
    color: ${darkText};
    border-radius: 8px;
    border: none;
    font-size: 16px;
    outline: 0;
    padding: 4px 8px;
  }
`;

export default InputWrapper;
