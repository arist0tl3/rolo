import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import useLocalStorage from 'use-local-storage';
import { FaCheck } from 'react-icons/fa';
import { MdClose } from 'react-icons/md';
import { FormEvent, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { Contact, Place } from 'types';

import { darkText, destroy, highlight, lightText, offWhite, secondary } from 'colors';

import Content from 'Content';
import Header from 'Header';
import HeaderTitle from 'HeaderTitle';
import InputWrapper from 'InputWrapper';
import PlacesAutocomplete from 'PlacesAutocomplete';
import UnstyledLink from 'UnstyledLink';

const EditContactButtons = styled.div`
  display: flex;
  flex-direction: row;
`;

const CancelEditContactButton = styled.button`
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

const CompleteEditContactButton = styled.button`
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

const DeleteButtonWrapper = styled.div`
  padding: 16px 16px 24px;
`;

const DeleteButton = styled.button`
  width: 100%;
  background: ${destroy};
  color: ${lightText};
  border: 0;
  border-radius: 8px;
  font-size: 16px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const times = ['Morning', 'Afternoon', 'Evening'];

function EditContact() {
  const navigate = useNavigate();
  const params = useParams();

  const { contactId = '' } = params;

  const [contacts, setContacts] = useLocalStorage<Contact[]>('contacts', []);

  const contact = contacts.find((c) => c._id === contactId);

  const [firstName, setFirstName] = useState<string>(contact?.firstName || '');
  const [shifts, setShifts] = useState<number[]>(contact?.shifts || []);
  const [place, setPlace] = useState<Place>();
  const [notes, setNotes] = useState<string>(contact?.notes || '');

  const handleEditContactFormSubmit = (e: FormEvent) => {
    e.preventDefault();
  };

  const handleShiftButtonClick = (shiftNumber: number) => {
    setShifts((cur) => (cur.includes(shiftNumber) ? cur.filter((n) => n !== shiftNumber) : cur.concat(shiftNumber)));
  };

  const resetContactState = () => {
    setFirstName('');
    setNotes('');
    setShifts([]);
    setPlace(undefined);
  };

  const handleCancelEditContactButtonClick = () => {
    resetContactState();

    navigate('/');
  };

  const handleCompleteEditContactButtonClick = async () => {
    await setContacts([
      ...contacts.filter((c) => c._id !== contactId),
      {
        _id: uuidv4(),
        firstName,
        notes,
        shifts,
        place: contact?.place || place,
      },
    ]);

    resetContactState();
    navigate('/');
  };

  const handleDeleteButtonClick = async () => {
    await setContacts([...contacts.filter((c) => c._id !== contactId)]);

    resetContactState();
    navigate('/');
  };

  return (
    <>
      <Header>
        <UnstyledLink to={'/'}>
          <HeaderTitle>{'Rolo'}</HeaderTitle>
        </UnstyledLink>
        <EditContactButtons>
          <CancelEditContactButton onClick={handleCancelEditContactButtonClick}>
            <MdClose />
          </CancelEditContactButton>
          <CompleteEditContactButton onClick={handleCompleteEditContactButtonClick}>
            <FaCheck />
          </CompleteEditContactButton>
        </EditContactButtons>
      </Header>
      <Content>
        <Form autoComplete={'off'} onSubmit={handleEditContactFormSubmit}>
          <h3>{'Update a friend'}</h3>

          <h4>{'Basics'}</h4>
          <InputWrapper>
            <label htmlFor={'first-name'}>{'First name'}</label>
            <input id={'first-name'} type={'text'} onChange={(e) => setFirstName(e.currentTarget.value)} value={firstName} />
          </InputWrapper>

          <PlacesAutocomplete defaultValue={contact?.place?.locationName} onChange={(value) => setPlace(value)} />

          <h4>{'Shifts'}</h4>
          <InputWrapper>
            {days.map((day, dayIndex) => (
              <>
                <label>{day}</label>
                <ShiftsButtons>
                  {times.map((time, timeIndex) => (
                    <ShiftButton
                      isActive={shifts.includes(dayIndex * 3 + timeIndex)}
                      onClick={() => handleShiftButtonClick(dayIndex * 3 + timeIndex)}
                    >
                      {time}
                    </ShiftButton>
                  ))}
                </ShiftsButtons>
              </>
            ))}
          </InputWrapper>

          <h4>{'Additional info'}</h4>
          <InputWrapper>
            <label htmlFor={'notes'}>{'Notes'}</label>
            <textarea onChange={(e) => setNotes(e.currentTarget.value)} value={notes} />
          </InputWrapper>
        </Form>

        <DeleteButtonWrapper>
          <DeleteButton onClick={handleDeleteButtonClick}>{'Remove this contact'}</DeleteButton>
        </DeleteButtonWrapper>
      </Content>
    </>
  );
}

export default EditContact;
