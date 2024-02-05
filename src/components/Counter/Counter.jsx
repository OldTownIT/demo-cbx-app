import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box } from '@mui/material';
import {
    decrement,
    increment,
    incrementByAmount,
    incrementAsync,
    incrementIfOdd,
    selectCount,
} from '../../store/counter/counterSlice';
import styles from './Counter.module.css';

function Counter() {
    const count = useSelector(selectCount);
    const dispatch = useDispatch();
    const [incrementAmount, setIncrementAmount] = useState('2');

    const incrementValue = Number(incrementAmount) || 0;

    return (
        <Box
            className={styles.wrapper}
            sx={{
                py: 10,
                px: 2,
                mt: 0,
                boxShadow: 3,
                borderRadius: 5,
                backgroundColor: 'grey.100',
                mb: 3,
            }}
        >
            <div className={styles.row}>
                <h3>REDUX EXAMPLE</h3>
            </div>
            <div className={styles.row}>
                <button
                    type="button"
                    className={styles.button}
                    aria-label="Decrement value"
                    title="Decrement value"
                    onClick={() => dispatch(decrement())}
                >
                    -
                </button>
                <span className={styles.value}>Count is: {count}</span>
                <button
                    type="button"
                    className={styles.button}
                    aria-label="Increment value"
                    title="Increment value"
                    onClick={() => dispatch(increment())}
                >
                    +
                </button>
            </div>
            <div className={styles.row2}>
                <input
                    className={styles.textbox}
                    type="number"
                    aria-label="Set increment amount"
                    value={incrementAmount}
                    onChange={(e) => setIncrementAmount(e.target.value)}
                />
                <button
                    type="button"
                    className={styles.button}
                    onClick={() => dispatch(incrementByAmount(incrementValue))}
                >
                    Add Amount
                </button>
                <button
                    type="button"
                    className={styles.asyncButton}
                    onClick={() => dispatch(incrementAsync(incrementValue))}
                >
                    Add Async
                </button>
                <button
                    type="button"
                    className={styles.button}
                    onClick={() => dispatch(incrementIfOdd(incrementValue))}
                >
                    Add If Odd
                </button>
            </div>
        </Box>
    );
}

export default Counter;
