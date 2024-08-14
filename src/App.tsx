import { useState, useEffect } from 'react'
import ProgressBar from "@ramonak/react-progress-bar";

import './App.css'

const styles = {
  inputGroup: {
    marginLeft: '50px',
    width: '600px',
    marginBottom: '15px',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
  },
  input: {
    width: '100%',
    padding: '8px',
    boxSizing: 'border-box',
    background: 'lightgrey',
    border: '0px',
    color: 'black',
  },
  inputDate: {
    width: '100%',
    padding: '8px',
    boxSizing: 'border-box',

  },
  textarea: {
    border: '0px',
    width: '100%',
    height: '60px',
    color: 'black',
    padding: '8px',
    boxSizing: 'border-box',
    background: 'lightgrey'
  },
};

const Sphere = ({ size }: any) => {
  return (
    <div
      className="sphere"
      style={{
        width: size,
        height: size,
      }}
    >
    </div>
  );
};

const getColor = (contributions: any) => {
  if (contributions === 0) return '#f0f0f0';
  if (contributions <= 2) return '#cae8ff';
  if (contributions <= 5) return '#70b7ff';
  return '#0366d6';
};

const ContributionCalendar = ({ days }: any) => {
    return (
      <div className="contribution-calendar">
        {days.map((day: any, index: any) => (
          <div
            key={index}
            className="contribution-tile"
            data-date={day.date}
            data-contributions={day.contributions}
            style={{ backgroundColor: getColor(day.contributions) }}
          />
        ))}
      </div>
    );
  };


  // const generateLastWeeks = (numWeeks = 24) => {
  //     const days = [];
  //     const today = new Date();
    
  //     // Calculate the start date to get full weeks
  //     const startDate = new Date(today);
  //     startDate.setDate(today.getDate() - (today.getDay() + numWeeks * 7)); // Start from the first Sunday of the range
    
  //     // Loop through each day from the start date until today
  //     for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
  //       const formattedDate = d.toISOString().split('T')[0]; // Format to 'YYYY-MM-DD'
  //       const contributions = Math.floor(Math.random() * 20); // Random contributions from 0 to 19
    
  //       days.push({ date: formattedDate, contributions });
  //     }
    
  //     return days;
  //   };


const StarRating = ({ index, rating, onUpdateRating, editable }: any) => {
  const totalStars = 5;

  const handleClick = (newRating: any) => {
    if (editable && onUpdateRating) {
      onUpdateRating(index,newRating);
    }
  };

  return (
    <div style={{cursor: editable ? 'pointer' : 'default', display: 'flex'}}>
      {Array.from({ length: totalStars }, (_, index) => (
        <span 
          key={index} 
          style={{ color: index < rating ? 'gold' : 'lightgray' }}
          onClick={() => handleClick(index + 1)}
        >
          ★
        </span>
      ))}
    </div>
  );
};

const MyComponent = (props: any) => {
  return (
    <div style={{ width: '590px', margin: '40px', padding: '16px', borderRadius: '10px', overflow: 'auto', maxHeight: '300px' }}>
      {props.entries.map((entry: any, index: any) => {
        const timeElapsed = new Date().getTime() - new Date(entry.dateTimeStart).getTime();
        const totalTime = new Date(entry.dateTimeEnding).getTime() - new Date(entry.dateTimeStart).getTime();
        const progress = totalTime > 0 ? Math.min((timeElapsed / totalTime) * 100, 100) : 0;

        return (
          <div key={index} style={{ background: getColor(4), padding: '45px', paddingLeft: '70px', paddingRight: '70px', marginBottom: '20px', borderRadius: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              {/* entry */}
              <div>
                <p>Entry</p>
                <p>{entry.entryInput}</p>
              </div>
              {/* exit */}
              <div>
                <p>Exit</p>
                <p>{entry.exitInput}</p>
                <StarRating index={index} onUpdateRating={props.updateRating} rating={entry.rating} editable={true}/>
              </div>
            </div>
            <br/>
            <br/>
            <div className="progress-bar-container">
              <ProgressBar bgColor="grey" completed={progress} />
            </div>
          </div>
        );
      })}
    </div>
  );
};


function convertToEST(date: any) {
  // Get the current UTC offset for the date
  const utcOffset = date.getTimezoneOffset() * 60000; // Convert minutes to milliseconds
  const utcDate = new Date(date.getTime() + utcOffset);

  // EST is UTC-5 during standard time and UTC-4 during daylight saving time (EDT)
  const estOffset = -5; // Standard time offset (EST is UTC-5)
  const edtOffset = -4; // Daylight Saving Time offset (EDT is UTC-4)

  // Determine whether the date falls within daylight saving time
  const jan = new Date(date.getFullYear(), 0, 1).getTimezoneOffset();
  const jul = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
  const dst = Math.max(jan, jul) !== date.getTimezoneOffset();

  const offset = dst ? edtOffset : estOffset;

  return new Date(utcDate.getTime() + (offset * 60 * 60 * 1000));
}

const generateLastWeeks = (entries: any, numWeeks = 24) => {
  const days = [];
  let today = new Date();
  today = convertToEST(today);

  // Calculate the start date to get full weeks
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - (today.getDay() + numWeeks * 7)); // Start from the first Sunday of the range
  startDate.setHours(0, 0, 0, 0); // Ensure startDate is at the start of the day in EST

  // Create an object to count the number of practices per day
  const practiceCounts: any = {};

  // Populate practiceCounts with the number of entries for each day
  entries.forEach((entry: any) => {
    // console.log(entry.dateTimeStart)
    const estDate = entry.dateTimeStart.slice(0,10)
    const date = estDate
    console.log(date)
    if (practiceCounts[date]) {
      practiceCounts[date] += 1;
    } else {
      practiceCounts[date] = 1;
    }
  });

  // Loop through each day from the start date until today
  for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
    const formattedDate = d.toISOString().split('T')[0]; // Format to 'YYYY-MM-DD'
    const contributions = practiceCounts[formattedDate] || 0; // Get the count or 0 if no practices
    // console.log(practiceCounts)
    // console.log(formattedDate)
    days.push({ date: formattedDate, contributions });
  }

  return days;
};

const App = () => {
  const [dateTime, setDateTime] = useState<any>('');
  // const days = generateLastWeeks();
  const [entrySideBoolean, setEntrySideBoolean] = useState<any>(false)
  const [exitSideBoolean, setExitSideBoolean] = useState<any>(false)
  const [entryInput, setEntryInput] = useState('')
  const [exitInput, setExitInput] = useState('')
  const [entries, setEntries] = useState<any>([]);

  const days = generateLastWeeks(entries);

  const updateRating = (index: any, newRating: any) => {
    const updatedEntries = entries.map((entry: any, i: any) => {
      if (i === index) {
        const updatedEntry = { ...entry, rating: newRating };
        return updatedEntry;
      }
      return entry;
    });

    setEntries(updatedEntries);
    localStorage.setItem('entries', JSON.stringify(updatedEntries));
  };

  const calculateAverageEntries = () => {
    const last7Days = entries.slice(-7);
    const totalEntries = last7Days.reduce((acc: number, day: any) => acc + day.contributions, 0);
    return totalEntries / 7;
  };

  const averageEntries = calculateAverageEntries();
  const sphereSize = Math.min(Math.max((averageEntries / 2.5) * 115, 50), 180);

  function convertToEST(date: any) {
    const utcOffset = date.getTimezoneOffset() * 60000; // Convert minutes to milliseconds
    const utcDate = new Date(date.getTime() + utcOffset);
  
    // EST is UTC-5 during standard time and UTC-4 during daylight saving time (EDT)
    const estOffset = -5; // Standard time offset (EST is UTC-5)
    const edtOffset = -4; // Daylight Saving Time offset (EDT is UTC-4)
  
    // Determine whether the date falls within daylight saving time
    const jan = new Date(date.getFullYear(), 0, 1).getTimezoneOffset();
    const jul = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
    const dst = Math.max(jan, jul) !== date.getTimezoneOffset();
  
    const offset = dst ? edtOffset : estOffset;
  
    const estDate = new Date(utcDate.getTime() + (offset * 60 * 60 * 1000));
  
    // Format the date string to 'YYYY-MM-DDTHH:mm:ss' without the 'Z'
    const year = estDate.getFullYear();
    const month = String(estDate.getMonth() + 1).padStart(2, '0');
    const day = String(estDate.getDate()).padStart(2, '0');
    const hours = String(estDate.getHours()).padStart(2, '0');
    const minutes = String(estDate.getMinutes()).padStart(2, '0');
    const seconds = String(estDate.getSeconds()).padStart(2, '0');
  
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  }

  useEffect(() => {
    if(!entrySideBoolean && !exitSideBoolean && (entryInput || exitInput)) {
      const obj = { 
        entryInput: entryInput,
        exitInput: exitInput,
        rating: 0,
        dateTimeStart: convertToEST(new Date()), // Convert and format current time to EST
        dateTimeEnding: dateTime,
        isDismissed: false
      };

      const updatedEntries = [...entries, obj];
      localStorage.setItem('entries', JSON.stringify(updatedEntries));
      setEntries(updatedEntries);
    }
  }, [entrySideBoolean, exitSideBoolean, entryInput, exitInput, dateTime]);

  useEffect(() => {
    const savedEntries = JSON.parse(localStorage.getItem('entries')!) || [];
    setEntries(savedEntries);
  }, []);

  return (
    <div className="App">
      {(exitSideBoolean || entrySideBoolean) && (
        <div style={styles.inputGroup}>
          <label style={styles.label}>Date and Time</label>
          <input
            type="datetime-local"
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
            // @ts-ignore
            style={styles.inputDate}
          />
        </div>
      )}
      
      <div className="sphere-container">
        <div style={{padding: entrySideBoolean ? '10px': ''}} className="hands" onClick={() => setEntrySideBoolean(true)}>
          {entrySideBoolean ? (
            <textarea onChange={(evt) => setEntryInput(evt.target.value)} style={{width: '104px', height: '170px'}}></textarea>
          ) : (
            <>
              <span>entry</span>
              <span>☛</span>
              <span>☞</span>
            </>
          )}
        </div>
        
        <div style={{cursor: 'pointer'}} onDoubleClick={() => {setEntrySideBoolean(true); setExitSideBoolean(true)}}  onClick={() => {if(entrySideBoolean && exitSideBoolean){ setEntrySideBoolean(!entrySideBoolean); setExitSideBoolean(!exitSideBoolean) }}}>
          <Sphere size={`${sphereSize}px`} />
        </div>
        
        <div onClick={() => setExitSideBoolean(true)} className="hands" style={{paddingLeft: !exitSideBoolean ? '45px': '10px', paddingRight: !exitSideBoolean ? '45px': '10px', padding: exitSideBoolean ? '10px': ''}}>
          {exitSideBoolean ? (
            <textarea onChange={(evt) => setExitInput(evt.target.value)} style={{width: '104px', height: '170px'}}></textarea>
          ) : (
            <>
              <span>exit</span>
              <span>☛</span>
              <span>☞</span>
            </>
          )}
        </div>
      </div>
      
      <ContributionCalendar days={days}/>
      <br/><br/><hr/><br/>
      <p>In progress practice</p>
      <MyComponent updateRating={updateRating} entries={entries}/>
    </div>
  );
};


export default App
