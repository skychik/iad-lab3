package beans;


import utils.Point;

import javax.faces.event.ValueChangeEvent;
import javax.faces.event.ValueChangeListener;
import java.io.Serializable;
import java.sql.*;
import java.util.ArrayList;
import java.util.logging.Level;
import java.util.logging.Logger;

import static java.lang.Double.parseDouble;

public class MainPageBean implements Serializable {
	private double x;
	private double y;
	private double r;
	private Connection connection;
	private Logger log = Logger.getLogger(MainPageBean.class.getName());

	public double getX() {
		return x;
	}

	public void setX(ValueChangeEvent e) {
		double newX = Double.parseDouble(e.getNewValue().toString());
		this.x = ((double) Math.round(newX * 2)) / 2;
	}

	public double getY() {
		return y;
	}

	public void setY(double y) {
		this.y = y;
	}

	public double getR() {
		return r;
	}

	public void setR(double r) {
		this.r = r;
	}

	public ArrayList<Point> getPoints() {
		Connection con = getConnection();
		String stm = "select * from public.points";
		ArrayList<Point> points = new ArrayList<Point>();

		try {
			PreparedStatement pst = con.prepareStatement(stm);
			pst.execute();
			ResultSet rs = pst.getResultSet();

			while(rs.next()) {
				Point point = new Point();
				point.setX(rs.getDouble("x"));
				point.setY(rs.getDouble("y"));
				point.setR(rs.getDouble("r"));
				point.setInRange(rs.getBoolean("in_range"));
				points.add(point);
			}
		} catch (SQLException e) {
			log.log(Level.SEVERE, "Exception: ", e);
		}
		return points;
	}

	private Connection getConnection() {
		if (connection == null) {
			Connection con = null;
			String url = "jdbc:postgresql://localhost:5432/pointsdb";
			String user = "user1";
			String password = "user1";

			try {
				Class.forName("org.postgresql.Driver");
				con = DriverManager.getConnection(url, user, password);
				System.out.println("Connection completed.");
			} catch (SQLException e1) {
				log.log(Level.SEVERE, "Can't connect to DB: ", e1);
			} catch (ClassNotFoundException e2) {
				log.log(Level.SEVERE, "Can't find driver: ", e2);
			}
			connection = con;
		}

		return connection;
	}

	public void submit() {
		log.log(Level.INFO, "---------submit-------------");
		boolean inRange = checkPoint(x, y, r);

		String stm = "INSERT INTO public.points(x, y, r, in_range) VALUES (?, ?, ?, ?);";
		try {
			PreparedStatement pstm = connection.prepareStatement(stm);
			pstm.setDouble(1, x);
			pstm.setDouble(2, y);
			pstm.setDouble(3, r);
			pstm.setBoolean(4, inRange);
			pstm.execute();
		} catch (SQLException e) {
			log.log(Level.SEVERE, "Can't make and execute prepared statement: ", e);
		}
	}

	private boolean checkPoint(double x, double y, double r) {
		if (x > 0) {
			if (y > 0) { // 1 quarter
				return false;
			} else { // 4 quarter
				return (x*x + y*y) <= r;
			}
		} else {
			if (y > 0) { // 2 quarter
				return ((-x)/2 + y/2) <= r;
			} else { // 3 quarter
				return ((-x)/2 <= r) && ((-y) <= r);
			}
		}
	}
}
