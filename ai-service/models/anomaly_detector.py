import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest

def detect_anomalies(data):
    df = pd.DataFrame(data)
    df['date'] = pd.to_datetime(df['date'])
    df = df.sort_values('date').reset_index(drop=True)

    X = df[['liters']].values
    clf = IsolationForest(contamination=0.15, random_state=42, n_estimators=100)
    preds = clf.fit_predict(X)
    scores = clf.score_samples(X)

    mean_liters = df['liters'].mean()
    std_liters = df['liters'].std()

    anomalies = []
    for idx, (pred, score) in enumerate(zip(preds, scores)):
        if pred == -1:
            row = df.iloc[idx]
            deviation = round(((row['liters'] - mean_liters) / max(mean_liters, 1)) * 100, 1)
            z_score = abs((row['liters'] - mean_liters) / max(std_liters, 1))
            if z_score > 3:
                severity = 'high'
            elif z_score > 2:
                severity = 'medium'
            else:
                severity = 'low'
            anomalies.append({
                'id': str(row.get('id', idx)),
                'date': row['date'].strftime('%Y-%m-%d'),
                'liters': float(row['liters']),
                'location': row.get('location', 'Unknown'),
                'deviation': deviation,
                'severity': severity,
                'anomalyScore': round(float(score), 4)
            })

    return {
        'anomalies': anomalies,
        'totalAnalyzed': len(df),
        'anomalyCount': len(anomalies),
        'algorithm': 'Isolation Forest'
    }
