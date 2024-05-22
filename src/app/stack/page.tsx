"use client"

import React, { useState } from 'react';
import { StackClient } from '@stackso/js-core/dist/src/client/StackClient';

interface AccountPoints {
  address: string;
  amount: number;
}

interface LeaderboardEntry {
  address: string;
  amount: number;
}

interface EventEntry {
  event: string;
  address: string;
  timestamp: string;
  points: number;
  metadata: Record<string, any>;
}

interface StackProps {
  props: string | undefined | null | string[];
}

const Stack = (props:any) => {
  const [points, setPoints] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [event, setEvent] = useState('');
  const [pointsToAdd, setPointsToAdd] = useState('');
  const [account, setAccount] = useState('');
  const [accounts, setAccounts] = useState('');
  const [accountsPoints, setAccountsPoints] = useState<AccountPoints[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [events, setEvents] = useState<EventEntry[]>([]);
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);

  const stack = new StackClient({
    apiKey: process.env.STACK_API as string, 
    pointSystemId: 2317,
  });

  async function getStackPoints() {
    setLoading(true);
    setError(null);

    try {
      console.log("Props is this account = ", props);
      console.log(typeof(props.props)); 
      const account = props.props; // Get value out of object

      if(account){
        const points = await stack.getPoints(account);
        console.log("Fetched points:", points);
        setPoints(points);
      }
      
    } catch (err: any) {
      console.error("Error <<<< ", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function addPoints() {
    setLoading(true);
    setError(null);

    try {
      await stack.track(event, {
        points: parseInt(pointsToAdd),
        account: account,
      });
      setEvent('');
      setPointsToAdd('');
      setAccount('');
      alert('Points added successfully');
    } catch (err:any) {
      console.log("Error <<<< ", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function getPointsForAccounts() {
    setLoading(true);
    setError(null);

    try {
      const accountsArray = accounts.split(',').map(acc => acc.trim());
      console.log("Fetching points for accounts:", accountsArray); 
      const points = await stack.getPoints(accountsArray);
      console.log("Fetched points:", points); 

      if (Array.isArray(points)) {
        const formattedPoints = points.map(point => ({
          address: point.address,
          amount: point.amount
        }));
        setAccountsPoints(formattedPoints);
      } else {
        throw new Error('Unexpected response format');
      }
    } catch (err:any) {
      console.log("Error <<<< ", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function getLeaderboard() {
    setLoading(true);
    setError(null);

    try {
      const leaderboard = await stack.getLeaderboard({ limit, offset });
      console.log("Fetched leaderboard:", leaderboard); 

      if (Array.isArray(leaderboard)) {
        setLeaderboard(leaderboard);
      } else {
        throw new Error('Unexpected response format');
      }
    } catch (err:any) {
      console.log("Error <<<< ", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function getEvents() {
    setLoading(true);
    setError(null);

    const filterParams = {
      //address: connectedAccount,
      // event: 'test_event',
      // limit: 1,
      // offset: 1
    };

    console.log("Fetching events with params:", filterParams); 

    try {
      const events = await stack.getEvents(filterParams);
      console.log("Fetched events:", events); 

      if (Array.isArray(events)) {
        setEvents(events);
      } else {
        throw new Error('Unexpected response format');
      }
    } catch (err:any) {
      console.log("Error <<<< ", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='w-50'>
      <div className='text-red-800'>Stack Integration</div>

      <div className="mt-2">
        <h2 className='font-bold'>Add Points</h2>
        <input
          type="text"
          placeholder="Event"
          value={event}
          onChange={(e) => setEvent(e.target.value)}
          className="block mb-2 p-2 border"
        />
        <input
          type="number"
          placeholder="Points"
          value={pointsToAdd}
          onChange={(e) => setPointsToAdd(e.target.value)}
          className="block mb-2 p-2 border"
        />
        <input
          type="text"
          placeholder="Account"
          value={account}
          onChange={(e) => setAccount(e.target.value)}
          className="block mb-2 p-2 border"
        />
        <button className="bg-purple-200 w-32 h-12" onClick={addPoints} disabled={loading}>
          {loading ? 'Loading...' : 'Add Points'}
        </button>
      </div>

      <div>----------------------------------------------------------------------------</div>

      <h2 className='font-bold'>Get Points</h2>

      <button className="bg-purple-200 w-40 h-12" onClick={getStackPoints} disabled={loading}>
        {loading ? 'Loading...' : 'Get Stack Points'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {points !== null && <p>User Points: {points}</p>}

      <div>----------------------------------------------------------------------------</div>
      <div className="mt-4">
        <h2 className='font-bold'>Get Points for list of Accounts</h2>
        <input
          type="text"
          placeholder="Accounts (comma-separated)"
          value={accounts}
          onChange={(e) => setAccounts(e.target.value)}
          className="block mb-2 p-2 border"
        />
        <button className="bg-purple-200 w-32 h-12" onClick={getPointsForAccounts} disabled={loading}>
          {loading ? 'Loading...' : 'Get Points'}
        </button>
        {accountsPoints.length > 0 && (
          <div>
            <h3>Accounts Points</h3>
            <ul>
              {accountsPoints.map((accountPoint, index) => (
                <li key={index}>
                  Account: {accountPoint.address}, Points: {accountPoint.amount}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div>----------------------------------------------------------------------------</div>

      <div className="mt-4">
        <h2 className='font-bold'>Leaderboard View</h2>
        <button className="bg-yellow-200 w-40 h-12" onClick={getLeaderboard} disabled={loading}>
          {loading ? 'Loading...' : 'Get Leaderboard'}
        </button>
        {leaderboard.length > 0 && (
          <div>
            <h3>Leaderboard</h3>
            <ul className="text-base">
              {leaderboard.map((entry, index) => (
                <li key={index}>
                  Account: {entry.address}, Points: {entry.amount}
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="mt-4">
          <button
            className="bg-gray-200 w-32 h-12 mr-2"
            onClick={() => {
              if (offset - limit >= 0) {
                setOffset(offset - limit);
                getLeaderboard();
              }
            }}
            disabled={loading || offset === 0}
          >
            Previous
          </button>
          <button
            className="bg-gray-200 w-32 h-12"
            onClick={() => {
              setOffset(offset + limit);
              getLeaderboard();
            }}
            disabled={loading}
          >
            Next
          </button>
        </div>
      </div>

      <div>----------------------------------------------------------------------------</div>

      <div className="mt-4">
        <h2 className='font-bold'>Events detail</h2>
        <button className="bg-green-200 w-32 h-12" onClick={getEvents} disabled={loading}>
          {loading ? 'Loading...' : 'Get Events'}
        </button>
        {events.length > 0 && (
          <div>
            <h3>Events</h3>
            <ul className="text-base">
              {events.map((eventEntry, index) => (
                <li key={index}>
                  Event: {eventEntry.event}, Address: {eventEntry.address}, Points: {eventEntry.points}, Timestamp: {eventEntry.timestamp}
                  <div>*********************</div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div>----------------------------------------------------------------------------</div>
    </div>
  );
};

export default Stack;
