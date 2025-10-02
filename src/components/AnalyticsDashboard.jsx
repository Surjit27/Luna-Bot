import React, { useState, useEffect } from 'react'
import { Card, CardBody, CardHeader, Button, Row, Col, Table, Badge, Progress } from 'reactstrap'
import { ragService } from '../services/ragService'
import { exportService } from '../services/exportService'

function AnalyticsDashboard() {
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedTimeRange, setSelectedTimeRange] = useState('all')

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      console.log('Loading dashboard data...')
      const data = await ragService.getDashboardData()
      console.log('Dashboard data received:', data)
      setDashboardData(data)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const createMockData = () => {
    const mockData = {
      totalSessions: 3,
      totalQuestionsAnswered: 15,
      averageScore: 75,
      categoryBreakdown: {
        dsa: 8,
        hr: 4,
        technical: 3
      },
      difficultyBreakdown: {
        easy: 5,
        medium: 7,
        hard: 3
      },
      recentSessions: [
        {
          id: 'session_1',
          startTime: new Date(),
          questions: [
            { id: 'q1', title: 'Two Sum', category: 'dsa', difficulty: 'easy' },
            { id: 'q2', title: 'Tell me about yourself', category: 'hr', difficulty: 'easy' }
          ]
        }
      ],
      scoreDistribution: { '0-20': 1, '21-40': 2, '41-60': 3, '61-80': 5, '81-100': 4 },
      topSkills: ['JavaScript', 'Problem Solving', 'Communication']
    }
    setDashboardData(mockData)
  }

  const exportToCSV = async () => {
    try {
      await exportService.exportInterviewData()
    } catch (error) {
      console.error('Error exporting data:', error)
    }
  }

  const getScoreColor = (score) => {
    if (score >= 80) return 'success'
    if (score >= 60) return 'warning'
    return 'danger'
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'success'
      case 'medium': return 'warning'
      case 'hard': return 'danger'
      default: return 'secondary'
    }
  }

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    )
  }

  if (!dashboardData) {
    return (
      <div className="container mt-4">
        <Card>
          <CardBody className="text-center">
            <h5>No Data Available</h5>
            <p>Start conducting interviews to see analytics here.</p>
            <div className="d-flex gap-2">
              <Button color="primary" onClick={loadDashboardData}>
                Refresh Data
              </Button>
              <Button color="secondary" onClick={createMockData}>
                Load Mock Data
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    )
  }

  return (
    <div className="container-fluid p-4 min-vh-100">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>📊 Analytics Dashboard</h2>
        <div>
          <Button color="success" onClick={exportToCSV} className="me-2">
            📥 Export CSV
          </Button>
          <Button color="info" onClick={loadDashboardData}>
            🔄 Refresh
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="dashboard-card">
            <CardBody className="text-center">
              <div className="stat-number">{dashboardData.totalSessions}</div>
              <div>Total Sessions</div>
            </CardBody>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="dashboard-card">
            <CardBody className="text-center">
              <div className="stat-number">{dashboardData.totalQuestionsAnswered}</div>
              <div>Questions Answered</div>
            </CardBody>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="dashboard-card">
            <CardBody className="text-center">
              <div className="stat-number">{dashboardData.averageScore}%</div>
              <div>Average Score</div>
            </CardBody>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="dashboard-card">
            <CardBody className="text-center">
              <div className="stat-number">
                {dashboardData.recentSessions?.length || 0}
              </div>
              <div>Recent Sessions</div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Row>
        {/* Category Breakdown */}
        <Col md={6}>
          <Card className="mb-4">
            <CardHeader>
              <h5>Questions by Category</h5>
            </CardHeader>
            <CardBody>
              {Object.entries(dashboardData.categoryBreakdown || {}).map(([category, count]) => (
                <div key={category} className="mb-3">
                  <div className="d-flex justify-content-between">
                    <span className="text-capitalize">{category}</span>
                    <span>{count}</span>
                  </div>
                  <Progress 
                    value={(count / dashboardData.totalQuestionsAnswered) * 100}
                    color="primary"
                  />
                </div>
              ))}
            </CardBody>
          </Card>
        </Col>

        {/* Difficulty Breakdown */}
        <Col md={6}>
          <Card className="mb-4">
            <CardHeader>
              <h5>Questions by Difficulty</h5>
            </CardHeader>
            <CardBody>
              {Object.entries(dashboardData.difficultyBreakdown || {}).map(([difficulty, count]) => (
                <div key={difficulty} className="mb-3">
                  <div className="d-flex justify-content-between">
                    <span className="text-capitalize">{difficulty}</span>
                    <span>{count}</span>
                  </div>
                  <Progress 
                    value={(count / dashboardData.totalQuestionsAnswered) * 100}
                    color={getDifficultyColor(difficulty)}
                  />
                </div>
              ))}
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Recent Sessions */}
      <Card className="mb-4">
        <CardHeader>
          <h5>Recent Interview Sessions</h5>
        </CardHeader>
        <CardBody>
          {dashboardData.recentSessions?.length > 0 ? (
            <Table responsive>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Candidate</th>
                  <th>Questions</th>
                  <th>Score</th>
                  <th>Duration</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.recentSessions.map((session, index) => (
                  <tr key={index}>
                    <td>{new Date(session.startTime).toLocaleDateString()}</td>
                    <td>{session.candidateName || 'Unknown'}</td>
                    <td>{session.questions?.length || 0}</td>
                    <td>
                      <Badge color={getScoreColor(session.averageScore || 0)}>
                        {session.averageScore || 0}%
                      </Badge>
                    </td>
                    <td>
                      {session.duration ? 
                        `${Math.floor(session.duration / 60)}m ${session.duration % 60}s` : 
                        'N/A'
                      }
                    </td>
                    <td>
                      <Badge color={session.status === 'completed' ? 'success' : 'warning'}>
                        {session.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p className="text-muted">No recent sessions found.</p>
          )}
        </CardBody>
      </Card>

      {/* Performance Trends */}
      <Card>
        <CardHeader>
          <h5>Performance Trends</h5>
        </CardHeader>
        <CardBody>
          <Row>
            <Col md={6}>
              <h6>Score Distribution</h6>
              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <span>Excellent (80-100%)</span>
                  <span>{dashboardData.scoreDistribution?.excellent || 0}</span>
                </div>
                <Progress value={dashboardData.scoreDistribution?.excellent || 0} color="success" />
              </div>
              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <span>Good (60-79%)</span>
                  <span>{dashboardData.scoreDistribution?.good || 0}</span>
                </div>
                <Progress value={dashboardData.scoreDistribution?.good || 0} color="warning" />
              </div>
              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <span>Needs Improvement (0-59%)</span>
                  <span>{dashboardData.scoreDistribution?.poor || 0}</span>
                </div>
                <Progress value={dashboardData.scoreDistribution?.poor || 0} color="danger" />
              </div>
            </Col>
            <Col md={6}>
              <h6>Top Skills Tested</h6>
              {dashboardData.topSkills?.map((skill, index) => (
                <div key={index} className="mb-2">
                  <div className="d-flex justify-content-between">
                    <span>{skill.name}</span>
                    <span>{skill.count}</span>
                  </div>
                  <Progress value={skill.percentage} color="info" />
                </div>
              )) || <p className="text-muted">No skill data available.</p>}
            </Col>
          </Row>
        </CardBody>
      </Card>
    </div>
  )
}

export default AnalyticsDashboard
