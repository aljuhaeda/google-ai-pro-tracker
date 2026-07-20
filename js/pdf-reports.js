// PDF Reports Generator - Phase 4.3
class PDFReportsGenerator {
  constructor(app) {
    this.app = app;
    this.jsPDFLoaded = false;
    this.init();
  }

  async init() {
    await this.loadJsPDF();
    console.log("📄 PDF Reports Generator initialized");
  }

  async loadJsPDF() {
    if (typeof jsPDF !== 'undefined') {
      this.jsPDFLoaded = true;
      return;
    }

    try {
      // Load jsPDF library dynamically
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
      script.onload = () => {
        this.jsPDFLoaded = true;
        console.log("✅ jsPDF library loaded");
      };
      script.onerror = () => {
        console.warn("⚠️ Failed to load jsPDF library, using fallback");
        this.jsPDFLoaded = false;
      };
      document.head.appendChild(script);
    } catch (error) {
      console.warn("⚠️ PDF generation not available:", error);
      this.jsPDFLoaded = false;
    }
  }

  async generateUsageReport(period = 'monthly') {
    if (!this.jsPDFLoaded) {
      this.generateFallbackReport(period);
      return;
    }

    try {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      
      // Set up document
      this.setupDocument(doc, `AI Pro Usage Report - ${period.charAt(0).toUpperCase() + period.slice(1)}`);
      
      let yPosition = 60;
      
      // Add executive summary
      yPosition = this.addExecutiveSummary(doc, yPosition, period);
      
      // Add usage breakdown
      yPosition = this.addUsageBreakdown(doc, yPosition, period);
      
      // Add insights and recommendations
      yPosition = this.addInsightsSection(doc, yPosition);
      
      // Add goals progress
      yPosition = this.addGoalsProgress(doc, yPosition);
      
      // Add footer
      this.addFooter(doc);
      
      // Save the PDF
      const filename = `ai-pro-usage-report-${period}-${this.getDateString()}.pdf`;
      doc.save(filename);
      
      this.app.showNotification(`📄 PDF report generated: ${filename}`, 'success');
      
    } catch (error) {
      console.error("Error generating PDF report:", error);
      this.generateFallbackReport(period);
    }
  }

  setupDocument(doc, title) {
    // Add header
    doc.setFontSize(20);
    doc.setFont(undefined, 'bold');
    doc.text(title, 20, 30);
    
    // Add subtitle
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, 20, 40);
    
    // Add line separator
    doc.setLineWidth(0.5);
    doc.line(20, 45, 190, 45);
  }

  addExecutiveSummary(doc, yPosition, period) {
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text('Executive Summary', 20, yPosition);
    yPosition += 15;
    
    // Calculate summary metrics
    const totalUsage = this.calculateTotalUsage(period);
    const productivityScore = this.app.analytics.getProductivityScore();
    const subscriptionValue = this.calculateSubscriptionValue();
    const topFeature = this.getTopFeature();
    
    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');
    
    const summaryText = [
      `• Total AI feature usage: ${totalUsage} interactions`,
      `• Productivity score: ${productivityScore}%`,
      `• Subscription value realized: $${subscriptionValue}`,
      `• Most used feature: ${topFeature.name} (${topFeature.usage} uses)`,
      `• Features actively used: ${this.getActiveFeatureCount()}/7`
    ];
    
    summaryText.forEach((text, index) => {
      doc.text(text, 25, yPosition + (index * 8));
    });
    
    return yPosition + (summaryText.length * 8) + 15;
  }

  addUsageBreakdown(doc, yPosition, period) {
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text('Usage Breakdown by Feature', 20, yPosition);
    yPosition += 15;
    
    // Create table headers
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.text('Feature', 25, yPosition);
    doc.text('Usage', 80, yPosition);
    doc.text('Quota', 110, yPosition);
    doc.text('Utilization', 140, yPosition);
    doc.text('Value', 170, yPosition);
    
    yPosition += 10;
    
    // Add line under headers
    doc.setLineWidth(0.2);
    doc.line(20, yPosition - 2, 190, yPosition - 2);
    
    doc.setFont(undefined, 'normal');
    
    // Add feature data
    Object.keys(CONFIG.features).forEach((featureId, index) => {
      const feature = CONFIG.features[featureId];
      const usage = this.app.data.usage.get(featureId);
      const utilization = Math.round((usage.monthly / feature.quotas.pro.monthly) * 100);
      const value = Math.round(feature.estimatedValue * (usage.monthly / feature.quotas.pro.monthly));
      
      doc.text(feature.name, 25, yPosition);
      doc.text(usage.monthly.toString(), 80, yPosition);
      doc.text(feature.quotas.pro.monthly.toString(), 110, yPosition);
      doc.text(`${utilization}%`, 140, yPosition);
      doc.text(`$${value}`, 170, yPosition);
      
      yPosition += 8;
    });
    
    return yPosition + 15;
  }

  addInsightsSection(doc, yPosition) {
    // Check if we need a new page
    if (yPosition > 220) {
      doc.addPage();
      yPosition = 30;
    }
    
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text('Key Insights & Recommendations', 20, yPosition);
    yPosition += 15;
    
    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');
    
    // Get insights from the insights engine
    const insights = this.app.insightsEngine ? this.app.insightsEngine.getTopInsights(5) : [];
    
    if (insights.length > 0) {
      insights.forEach((insight, index) => {
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 30;
        }
        
        doc.setFont(undefined, 'bold');
        doc.text(`${insight.icon} ${insight.title}`, 25, yPosition);
        yPosition += 8;
        
        doc.setFont(undefined, 'normal');
        const wrappedText = this.wrapText(doc, insight.message, 160);
        wrappedText.forEach(line => {
          doc.text(line, 25, yPosition);
          yPosition += 6;
        });
        
        yPosition += 5;
      });
    } else {
      doc.text('• Continue using AI features regularly to generate insights', 25, yPosition);
      doc.text('• Set goals to track your progress and achievements', 25, yPosition + 8);
      doc.text('• Explore underutilized features to maximize subscription value', 25, yPosition + 16);
      yPosition += 30;
    }
    
    return yPosition;
  }

  addGoalsProgress(doc, yPosition) {
    // Check if we need a new page
    if (yPosition > 200) {
      doc.addPage();
      yPosition = 30;
    }
    
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text('Goals Progress', 20, yPosition);
    yPosition += 15;
    
    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');
    
    const goals = this.app.goalManager ? this.app.goalManager.getActiveGoals() : [];
    
    if (goals.length > 0) {
      goals.slice(0, 5).forEach(goal => {
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 30;
        }
        
        doc.setFont(undefined, 'bold');
        doc.text(`🎯 ${goal.title}`, 25, yPosition);
        yPosition += 8;
        
        doc.setFont(undefined, 'normal');
        doc.text(`Progress: ${Math.round(goal.progress)}% complete`, 25, yPosition);
        doc.text(`Target: ${goal.target} ${goal.type}`, 25, yPosition + 6);
        
        // Draw progress bar
        const barWidth = 100;
        const barHeight = 4;
        const progressWidth = (goal.progress / 100) * barWidth;
        
        // Background bar
        doc.setFillColor(230, 230, 230);
        doc.rect(25, yPosition + 10, barWidth, barHeight, 'F');
        
        // Progress bar
        doc.setFillColor(66, 133, 244);
        doc.rect(25, yPosition + 10, progressWidth, barHeight, 'F');
        
        yPosition += 25;
      });
    } else {
      doc.text('• No active goals set', 25, yPosition);
      doc.text('• Consider setting goals to track your AI usage progress', 25, yPosition + 8);
      yPosition += 25;
    }
    
    return yPosition;
  }

  addFooter(doc) {
    const pageCount = doc.internal.getNumberOfPages();
    
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setFont(undefined, 'normal');
      doc.text(`Generated by AI Pro Tracker - Page ${i} of ${pageCount}`, 20, 285);
      doc.text(`Report Date: ${new Date().toLocaleDateString()}`, 140, 285);
    }
  }

  wrapText(doc, text, maxWidth) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';
    
    words.forEach(word => {
      const testLine = currentLine + (currentLine ? ' ' : '') + word;
      const textWidth = doc.getTextWidth(testLine);
      
      if (textWidth > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    });
    
    if (currentLine) {
      lines.push(currentLine);
    }
    
    return lines;
  }

  generateFallbackReport(period) {
    // Generate a text-based report as fallback
    const reportData = this.generateReportData(period);
    const textReport = this.formatTextReport(reportData, period);
    
    // Create and download as text file
    const blob = new Blob([textReport], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-pro-usage-report-${period}-${this.getDateString()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    this.app.showNotification('📄 Text report generated (PDF not available)', 'info');
  }

  generateReportData(period) {
    const data = {
      period,
      generatedAt: new Date().toISOString(),
      totalUsage: this.calculateTotalUsage(period),
      productivityScore: this.app.analytics.getProductivityScore(),
      subscriptionValue: this.calculateSubscriptionValue(),
      features: {},
      insights: this.app.insightsEngine ? this.app.insightsEngine.getTopInsights(5) : [],
      goals: this.app.goalManager ? this.app.goalManager.getActiveGoals() : []
    };
    
    // Add feature data
    Object.keys(CONFIG.features).forEach(featureId => {
      const feature = CONFIG.features[featureId];
      const usage = this.app.data.usage.get(featureId);
      
      data.features[featureId] = {
        name: feature.name,
        icon: feature.icon,
        usage: usage.monthly,
        quota: feature.quotas.pro.monthly,
        utilization: Math.round((usage.monthly / feature.quotas.pro.monthly) * 100),
        value: Math.round(feature.estimatedValue * (usage.monthly / feature.quotas.pro.monthly))
      };
    });
    
    return data;
  }

  formatTextReport(data, period) {
    let report = '';
    
    report += `AI PRO USAGE REPORT - ${period.toUpperCase()}\n`;
    report += `Generated on: ${new Date(data.generatedAt).toLocaleDateString()}\n`;
    report += `${'='.repeat(50)}\n\n`;
    
    // Executive Summary
    report += `EXECUTIVE SUMMARY\n`;
    report += `-`.repeat(20) + '\n';
    report += `Total AI feature usage: ${data.totalUsage} interactions\n`;
    report += `Productivity score: ${data.productivityScore}%\n`;
    report += `Subscription value realized: $${data.subscriptionValue}\n`;
    report += `Features actively used: ${this.getActiveFeatureCount()}/7\n\n`;
    
    // Feature Breakdown
    report += `USAGE BREAKDOWN BY FEATURE\n`;
    report += `-`.repeat(30) + '\n';
    report += `Feature                    Usage    Quota    Utilization    Value\n`;
    report += `-`.repeat(65) + '\n';
    
    Object.values(data.features).forEach(feature => {
      const name = feature.name.padEnd(25);
      const usage = feature.usage.toString().padEnd(8);
      const quota = feature.quota.toString().padEnd(8);
      const utilization = `${feature.utilization}%`.padEnd(14);
      const value = `$${feature.value}`;
      
      report += `${name} ${usage} ${quota} ${utilization} ${value}\n`;
    });
    
    report += '\n';
    
    // Insights
    if (data.insights.length > 0) {
      report += `KEY INSIGHTS & RECOMMENDATIONS\n`;
      report += `-`.repeat(35) + '\n';
      
      data.insights.forEach((insight, index) => {
        report += `${index + 1}. ${insight.title}\n`;
        report += `   ${insight.message}\n\n`;
      });
    }
    
    // Goals
    if (data.goals.length > 0) {
      report += `GOALS PROGRESS\n`;
      report += `-`.repeat(15) + '\n';
      
      data.goals.forEach((goal, index) => {
        report += `${index + 1}. ${goal.title}\n`;
        report += `   Progress: ${Math.round(goal.progress)}% complete\n`;
        report += `   Target: ${goal.target} ${goal.type}\n\n`;
      });
    }
    
    report += `\nReport generated by AI Pro Tracker\n`;
    report += `${new Date().toLocaleDateString()}\n`;
    
    return report;
  }

  // Utility methods
  calculateTotalUsage(period) {
    let total = 0;
    this.app.data.usage.forEach(usage => {
      total += period === 'monthly' ? usage.monthly : usage.daily;
    });
    return total;
  }

  calculateSubscriptionValue() {
    let totalValue = 0;
    this.app.data.usage.forEach((usage, featureId) => {
      const feature = CONFIG.features[featureId];
      const utilizationRate = Math.min(usage.monthly / feature.quotas.pro.monthly, 1);
      totalValue += feature.estimatedValue * utilizationRate;
    });
    return Math.round(totalValue);
  }

  getTopFeature() {
    let topFeature = { name: 'None', usage: 0 };
    let maxUsage = 0;
    
    this.app.data.usage.forEach((usage, featureId) => {
      if (usage.monthly > maxUsage) {
        maxUsage = usage.monthly;
        topFeature = {
          name: CONFIG.features[featureId].name,
          usage: maxUsage
        };
      }
    });
    
    return topFeature;
  }

  getActiveFeatureCount() {
    let count = 0;
    this.app.data.usage.forEach(usage => {
      if (usage.monthly > 0) count++;
    });
    return count;
  }

  getDateString() {
    const date = new Date();
    return date.toISOString().split('T')[0];
  }

  // Public API
  async generateMonthlyReport() {
    await this.generateUsageReport('monthly');
  }

  async generateWeeklyReport() {
    await this.generateUsageReport('weekly');
  }

  async generateCustomReport(options = {}) {
    const {
      period = 'monthly',
      includeCharts = false,
      includePredictions = false,
      includeComparisons = false
    } = options;
    
    // Enhanced report generation with additional options
    if (!this.jsPDFLoaded) {
      this.generateFallbackReport(period);
      return;
    }

    try {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      
      this.setupDocument(doc, `AI Pro Custom Report - ${period.charAt(0).toUpperCase() + period.slice(1)}`);
      
      let yPosition = 60;
      
      yPosition = this.addExecutiveSummary(doc, yPosition, period);
      yPosition = this.addUsageBreakdown(doc, yPosition, period);
      yPosition = this.addInsightsSection(doc, yPosition);
      yPosition = this.addGoalsProgress(doc, yPosition);
      
      if (includePredictions && this.app.mlAnalytics) {
        yPosition = this.addPredictionsSection(doc, yPosition);
      }
      
      if (includeComparisons) {
        yPosition = this.addComparisonSection(doc, yPosition);
      }
      
      this.addFooter(doc);
      
      const filename = `ai-pro-custom-report-${period}-${this.getDateString()}.pdf`;
      doc.save(filename);
      
      this.app.showNotification(`📄 Custom PDF report generated: ${filename}`, 'success');
      
    } catch (error) {
      console.error("Error generating custom PDF report:", error);
      this.generateFallbackReport(period);
    }
  }

  addPredictionsSection(doc, yPosition) {
    if (yPosition > 200) {
      doc.addPage();
      yPosition = 30;
    }
    
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text('Usage Predictions', 20, yPosition);
    yPosition += 15;
    
    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');
    
    const predictions = this.app.mlAnalytics.getPredictions();
    
    Object.keys(predictions).slice(0, 3).forEach(featureId => {
      const prediction = predictions[featureId];
      const feature = CONFIG.features[featureId];
      
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 30;
      }
      
      doc.setFont(undefined, 'bold');
      doc.text(`${feature.icon} ${feature.name}`, 25, yPosition);
      yPosition += 8;
      
      doc.setFont(undefined, 'normal');
      doc.text(`Next 7 days predicted usage: ${prediction.predictions.reduce((sum, p) => sum + p.predicted, 0)}`, 25, yPosition);
      doc.text(`Prediction accuracy: ${prediction.accuracy}%`, 25, yPosition + 6);
      
      yPosition += 20;
    });
    
    return yPosition;
  }

  addComparisonSection(doc, yPosition) {
    if (yPosition > 200) {
      doc.addPage();
      yPosition = 30;
    }
    
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text('Period Comparison', 20, yPosition);
    yPosition += 15;
    
    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');
    
    // Add comparison data (this would need historical data to be meaningful)
    doc.text('• Month-over-month comparison will be available with more historical data', 25, yPosition);
    doc.text('• Track trends and improvements over time', 25, yPosition + 8);
    
    return yPosition + 25;
  }
}