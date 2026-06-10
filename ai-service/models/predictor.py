import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression
from datetime import datetime, timedelta

def predict_consumption(data):
    df = pd.DataFrame(data)
    df['date'] = pd.to_datetime(df['date'])
    df = df.sort_values('date').reset_index(drop=True)
    df['day_num'] = (df['date'] - df['date'].min()).dt.days
    df['dow'] = df['date'].dt.dayofweek
    df['month'] = df['date'].dt.month

    X = df[['day_num', 'dow', 'month']].values
    y = df['liters'].values

    model = LinearRegression()
    model.fit(X, y)

    last_date = df['date'].max()
    last_day = df['day_num'].max()

    # Forecast next 30 days
    forecast = []
    for i in range(1, 31):
        future_date = last_date + timedelta(days=i)
        features = np.array([[last_day + i, future_date.weekday(), future_date.month]])
        pred = max(0, float(model.predict(features)[0]))
        forecast.append({ 'date': future_date.strftime('%Y-%m-%d'), 'predicted': round(pred, 1) })

    next_day = forecast[0]['predicted']
    next_week = round(sum(f['predicted'] for f in forecast[:7]), 1)
    next_month = round(sum(f['predicted'] for f in forecast), 1)

    r_sq = round(float(model.score(X, y)), 3)

    return {
        'nextDay': next_day,
        'nextWeek': next_week,
        'nextMonth': next_month,
        'forecast': forecast,
        'modelAccuracy': r_sq,
        'algorithm': 'Linear Regression'
    }
