import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import useLocalStorage from 'use-local-storage';
import { FaCheck } from 'react-icons/fa';
import { MdClose } from 'react-icons/md';
import { FormEvent, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { darkText, highlight, lightText, offWhite, secondary } from 'colors';

import Content from 'Content';
import Header from 'Header';
import HeaderTitle from 'HeaderTitle';
import InputWrapper from 'InputWrapper';
import PlacesAutocomplete from 'PlacesAutocomplete';

const CreateContactButtons = styled.div`
  display: flex;
  flex-direction: row;
`;

const CancelCreateContactButton = styled.button`
  outline: 0;
  border: 0;
  background: ${secondary};
  height: 28px;
  border-radius: 4px;
  margin-right: 8px;

  svg {
    fill: ${darkText};
  }
`;

const CompleteCreateContactButton = styled.button`
  outline: 0;
  border: 0;
  background: ${highlight};
  height: 28px;
  border-radius: 4px;

  svg {
    fill: ${lightText};
  }
`;

const Form = styled.form`
  color: ${darkText};
  padding: 16px;

  h3 {
    margin-bottom: 12px;
  }
`;

const ShiftsButtons = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  margin-bottom: 8px;
`;

type ShiftButtonProps = {
  isActive?: boolean;
};

const ShiftButton = styled.button<ShiftButtonProps>`
  width: 33.33%;
  background: ${(props) => (!props.isActive ? offWhite : highlight)};
  color: ${(props) => (!props.isActive ? darkText : lightText)};
  border: 0;
  margin: 0 3px;
  border-radius: 8px;
  font-size: 16px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const times = ['Morning', 'Afternoon', 'Evening'];

function CreateContact() {
  const navigate = useNavigate();

  const [contacts, setContacts] = useLocalStorage<any>('contacts', []);

  const [firstName, setFirstName] = useState<string>('');
  const [selectedShifts, setSelectedShifts] = useState<number[]>([]);
  const [place, setPlace] = useState<any>();

  const handleCreateContactFormSubmit = (e: FormEvent) => {
    e.preventDefault();
  };

  const handleShiftButtonClick = (shiftNumber: number) => {
    setSelectedShifts((cur) => (cur.includes(shiftNumber) ? cur.filter((n) => n !== shiftNumber) : cur.concat(shiftNumber)));
  };

  const resetContactState = () => {
    setFirstName('');
    setSelectedShifts([]);
    setPlace(undefined);
  };

  const handleCancelCreateContactButtonClick = () => {
    resetContactState();

    navigate('/');
  };

  const handleCompleteCreateContactButtonClick = async () => {
    await setContacts([
      ...contacts,
      {
        _id: uuidv4(),
        firstName,
        selectedShifts,
        place,
      },
    ]);

    resetContactState();
    navigate('/');
  };

  return (
    <>
      <Header>
        <HeaderTitle>{'Rolo'}</HeaderTitle>
        <CreateContactButtons>
          <CancelCreateContactButton onClick={handleCancelCreateContactButtonClick}>
            <MdClose />
          </CancelCreateContactButton>
          <CompleteCreateContactButton onClick={handleCompleteCreateContactButtonClick}>
            <FaCheck />
          </CompleteCreateContactButton>
        </CreateContactButtons>
      </Header>
      <Content>
        <Form onSubmit={handleCreateContactFormSubmit}>
          <h3>{'Add a friend'}</h3>

          <h4>{'Basics'}</h4>
          <InputWrapper>
            <label htmlFor={'first-name'}>{'First name'}</label>
            <input id={'first-name'} type={'text'} onChange={(e) => setFirstName(e.currentTarget.value)} value={firstName} />
          </InputWrapper>

          <PlacesAutocomplete onChange={(value) => setPlace(value)} />

          <h4>{'Shifts'}</h4>
          <InputWrapper>
            {days.map((day, dayIndex) => (
              <>
                <label>{day}</label>
                <ShiftsButtons>
                  {times.map((time, timeIndex) => (
                    <ShiftButton
                      isActive={selectedShifts.includes(dayIndex * 3 + timeIndex)}
                      onClick={() => handleShiftButtonClick(dayIndex * 3 + timeIndex)}
                    >
                      {time}
                    </ShiftButton>
                  ))}
                </ShiftsButtons>
              </>
            ))}
          </InputWrapper>
        </Form>
      </Content>
    </>
  );
}

export default CreateContact;
