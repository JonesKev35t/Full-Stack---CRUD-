import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const FakeNewsDetector = () => {
  const [article, setArticle] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const analyzeArticle = async () => {
    if (!article.trim()) {
      setError('Please enter an article to analyze');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      // Replace this with your actual API endpoint
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ article }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze article');
      }

      const data = await response.json();
      setResult({
        prediction: data.prediction[0][0],
        label: data.result,
      });
    } catch (err) {
      setError('Failed to analyze article. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Fake News Detection System
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Enter news article for analysis:
            </label>
            <Textarea
              placeholder="Paste your article here..."
              className="min-h-[200px]"
              value={article}
              onChange={(e) => setArticle(e.target.value)}
            />
          </div>

          <Button
            onClick={analyzeArticle}
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Analyze Article'
            )}
          </Button>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {result && (
            <Alert className={result.label === 'Real' ? 'bg-green-50' : 'bg-red-50'}>
              <div className="flex items-center">
                <CheckCircle2 className="h-4 w-4 mr-2" />
                <div>
                  <AlertTitle>
                    This article appears to be: {result.label}
                  </AlertTitle>
                  <AlertDescription>
                    Confidence Score: {(result.prediction * 100).toFixed(2)}%
                  </AlertDescription>
                </div>
              </div>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FakeNewsDetector;