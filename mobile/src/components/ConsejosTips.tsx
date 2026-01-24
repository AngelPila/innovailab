import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

interface Props {
  titulo?: string;
  title?: string;
  consejos: string[];
  tipo?: 'info' | 'warning' | 'success' | 'error';
  type?: 'info' | 'warning' | 'success' | 'error';
}

export function ConsejosTips({ titulo, title, consejos, tipo, type = 'info' }: Props) {
  const finalTitle = title || titulo || '';
  const finalType = type || tipo || 'info';
  const getStyles = (tipType: string) => {
    const typeStyles: Record<string, any> = {
      info: {
        backgroundColor: '#dbeafe',
        borderColor: '#0284c7',
        iconBg: '#0284c7',
        icon: 'ℹ️',
        textColor: '#0c4a6e',
      },
      warning: {
        backgroundColor: '#fef08a',
        borderColor: '#fbbf24',
        iconBg: '#fbbf24',
        icon: '⚠️',
        textColor: '#92400e',
      },
      success: {
        backgroundColor: '#dcfce7',
        borderColor: '#22c55e',
        iconBg: '#22c55e',
        icon: '✓',
        textColor: '#166534',
      },
      error: {
        backgroundColor: '#fee2e2',
        borderColor: '#f87171',
        iconBg: '#f87171',
        icon: '✕',
        textColor: '#991b1b',
      },
    };
    return typeStyles[tipType] || typeStyles.info;
  };

  const typeStyle = getStyles(finalType);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: typeStyle.backgroundColor,
          borderColor: typeStyle.borderColor,
        },
      ]}
    >
      <View style={styles.header}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: typeStyle.iconBg },
          ]}
        >
          <Text style={styles.icon}>{typeStyle.icon}</Text>
        </View>
        <Text
          style={[
            styles.titulo,
            { color: typeStyle.textColor },
          ]}
        >
          {finalTitle}
        </Text>
      </View>

      {consejos.length > 0 && (
        <View style={styles.consejosContainer}>
          {consejos.map((consejo, index) => (
            <View key={index} style={styles.consejoItem}>
              <Text
                style={[
                  styles.consejoBullet,
                  { color: typeStyle.textColor },
                ]}
              >
                •
              </Text>
              <Text
                style={[
                  styles.consejoText,
                  { color: typeStyle.textColor },
                ]}
              >
                {consejo}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 2,
    padding: 16,
    marginVertical: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 20,
  },
  titulo: {
    fontSize: 15,
    fontWeight: '700',
    flex: 1,
  },
  consejosContainer: {
    marginTop: 8,
  },
  consejoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  consejoBullet: {
    fontSize: 18,
    marginRight: 10,
    marginTop: -4,
  },
  consejoText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '500',
  },
});
