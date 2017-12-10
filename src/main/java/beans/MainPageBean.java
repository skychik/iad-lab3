package beans;


import utils.Point;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class MainPageBean {
	private double x;
	private double y;
	private double r;
	private ArrayList<Point> points;

	public double getX() {
		return x;
	}

	public void setX(double x) {
		this.x = x;
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
		ResultSet rs;
		PreparedStatement pst;
		Connection con = getConnection();
		String stm = "select * from public.\"points\"";
		ArrayList<Point> points = new ArrayList<Point>();

		try {
			pst = con.prepareStatement(stm);
			pst.execute();
			rs = pst.getResultSet();

			while(rs.next()) {
				Point point = new Point();
				point.setX(rs.getDouble(1));
				point.setY(rs.getDouble(2));
				point.setR(rs.getDouble(3));
				point.setInRange(rs.getBoolean(4));
				points.add(point);
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return points;
	}

	private Connection getConnection() {
		Connection con = null;
		String url = "jdbc:postgresql://localhost/pointsdb";
		String user = "user1";
		String password = "user1";

		try {
			con = DriverManager.getConnection(url, user, password);
			System.out.println("Connection completed.");
		} catch (SQLException ex) {
			System.out.println(ex.getMessage());
		}

		finally {
		}
		return con;
	}
}
